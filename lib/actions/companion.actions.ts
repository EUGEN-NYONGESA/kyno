"use server";

import { auth } from "@clerk/nextjs/server";
import { createSupabaseClient } from "@/lib/supabase";
import { revalidatePath } from "next/cache";

export const createCompanion = async (formData: CreateCompanion) => {
  try {
    const { userId: author } = await auth();
    const supabase = createSupabaseClient();

    const { data, error } = await supabase
      .from("companions")
      .insert({ ...formData, author })
      .select();

    if (error || !data) {
      throw new Error(error?.message || "Failed to create a companion");
    }

    return data[0];
  } catch (error) {
    console.error('Error creating companion:', error);
    throw error;
  }
};

export const getAllCompanions = async ({
  limit = 10,
  page = 1,
  subject,
  topic,
}: GetAllCompanions) => {
  try {
    const supabase = createSupabaseClient();

    let query = supabase.from("companions").select(`
      id, 
      name, 
      subject, 
      topic, 
      duration,
      author,
      created_at
    `);

    if (subject && topic) {
      query = query
        .ilike("subject", `%${subject}%`)
        .or(`topic.ilike.%${topic}%,name.ilike.%${topic}%`);
    } else if (subject) {
      query = query.ilike("subject", `%${subject}%`);
    } else if (topic) {
      query = query.or(`topic.ilike.%${topic}%,name.ilike.%${topic}%`);
    }

    query = query.range((page - 1) * limit, page * limit - 1);

    const { data: companions, error } = await query;

    if (error) {
      console.error("Database error:", error);
      return [];
    }

    return (
      companions?.map((companion) => ({
        ...companion,
        bookmarked: false,
      })) || []
    );
  } catch (error) {
    console.error('Error getting all companions:', error);
    return [];
  }
};

export const getCompanion = async (id: string) => {
  try {
    const supabase = createSupabaseClient();

    let { data, error } = await supabase.from("companions").select().eq("id", id);

    if (!data || data.length === 0 || error) {
      const { data: slugData, error: slugError } = await supabase
        .from("companions")
        .select()
        .ilike("name", `%${id.replace(/-/g, " ")}%`);

      if (slugError) {
        console.log(slugError);
        throw new Error(`Companion not found: ${slugError.message}`);
      }

      if (!slugData || slugData.length === 0) {
        throw new Error("Companion not found");
      }

      data = slugData;
      error = slugError;
    }

    if (error) {
      console.log(error);
      throw new Error(error.message);
    }

    if (!data || data.length === 0) {
      throw new Error("Companion not found");
    }

    return data[0];
  } catch (error) {
    console.error('Error getting companion:', error);
    throw error;
  }
};

export const addToSessionHistory = async (companionId: string) => {
  try {
    const { userId } = await auth();
    const supabase = createSupabaseClient();
    
    const { data, error } = await supabase.from("session_history").insert({
      companion_id: companionId,
      user_id: userId,
    });

    if (error) throw new Error(error.message);

    return data;
  } catch (error) {
    console.error('Error adding to session history:', error);
    throw error;
  }
};

export const getRecentSessions = async (limit = 10) => {
  try {
    const supabase = createSupabaseClient();
    const { data, error } = await supabase
      .from("session_history")
      .select(`companions:companion_id (*)`)
      .order("created_at", { ascending: false })
      .limit(limit);

    if (error) throw new Error(error.message);

    const uniqueCompanions = data.reduce((acc, { companions }) => {
      if (companions && !acc.find((comp) => comp.id === companions.id)) {
        acc.push(companions);
      }
      return acc;
    }, []);

    return uniqueCompanions;
  } catch (error) {
    console.error('Error getting recent sessions:', error);
    return [];
  }
};

export const getUserSessions = async (userId: string, limit = 10) => {
  try {
    const supabase = createSupabaseClient();
    const { data, error } = await supabase
      .from("session_history")
      .select(`companions:companion_id (*)`)
      .eq("user_id", userId)
      .order("created_at", { ascending: false })
      .limit(limit);

    if (error) {
      console.error('Error getting user sessions:', error);
      return [];
    }

    return data?.map(({ companions }) => companions) || [];
  } catch (error) {
    console.error('Error getting user sessions:', error);
    return [];
  }
};

export const getUserCompanions = async (userId: string) => {
  try {
    const supabase = createSupabaseClient();
    const { data, error } = await supabase
      .from("companions")
      .select()
      .eq("author", userId);

    if (error) {
      console.error('Error getting user companions:', error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error('Error getting user companions:', error);
    return [];
  }
};

export const newCompanionPermissions = async () => {
  try {
    const { userId, has } = await auth();

    if (!userId) return false;

    const supabase = createSupabaseClient();

    let limit = 5;

    if (has({ plan: "pro_companion" })) {
      return true;
    } else if (has({ plan: "core_learner" })) {
      limit = 10;
    } else if (has({ feature: "unlimited_companions" })) {
      return true;
    } else if (has({ feature: "10_companions_limit" })) {
      limit = 10;
    } else if (has({ feature: "5_companions_limit" })) {
      limit = 5;
    }

    const { data, error } = await supabase
      .from("companions")
      .select("id", { count: "exact" })
      .eq("author", userId);

    if (error) {
      console.error('Error checking companion permissions:', error);
      return false;
    }

    const companionCount = data?.length || 0;
    return companionCount < limit;
  } catch (error) {
    console.error('Error checking companion permissions:', error);
    return false;
  }
};

// TEMPORARY WORKAROUND - Disable bookmarks until schema is fixed
export const addBookmark = async (companionId: string, path: string) => {
  try {
    console.warn('Bookmarks temporarily disabled - schema needs updating');
    return null;
  } catch (error) {
    console.error('Error adding bookmark:', error);
    return null;
  }
};

export const removeBookmark = async (companionId: string, path: string) => {
  try {
    console.warn('Bookmarks temporarily disabled - schema needs updating');
    return null;
  } catch (error) {
    console.error('Error removing bookmark:', error);
    return null;
  }
};

export const getBookmarkedCompanions = async (userId: string) => {
  try {
    console.warn('Bookmarks temporarily disabled - schema needs updating');
    return [];
  } catch (error) {
    console.error('Error getting bookmarked companions:', error);
    return [];
  }
};

export const isBookmarksEnabled = async (): Promise<boolean> => {
  return false; // Temporarily disable until schema is fixed
};

export const isCompanionBookmarked = async (companionId: string): Promise<boolean> => {
  return false; // Temporarily disable until schema is fixed
};

// Alternative: Client-side only bookmarks (localStorage)
export const getLocalBookmarks = async (): Promise<string[]> => {
  if (typeof window === 'undefined') return [];
  
  try {
    const bookmarks = localStorage.getItem('companion-bookmarks');
    return bookmarks ? JSON.parse(bookmarks) : [];
  } catch (error) {
    console.error('Error getting local bookmarks:', error);
    return [];
  }
};

export const addLocalBookmark = async (companionId: string): Promise<boolean> => {
  if (typeof window === 'undefined') return false;
  
  try {
    const currentBookmarks = await getLocalBookmarks();
    const updatedBookmarks = [...currentBookmarks, companionId];
    localStorage.setItem('companion-bookmarks', JSON.stringify(updatedBookmarks));
    return true;
  } catch (error) {
    console.error('Error adding local bookmark:', error);
    return false;
  }
};

export const removeLocalBookmark = async (companionId: string): Promise<boolean> => {
  if (typeof window === 'undefined') return false;
  
  try {
    const currentBookmarks = await getLocalBookmarks();
    const updatedBookmarks = currentBookmarks.filter(id => id !== companionId);
    localStorage.setItem('companion-bookmarks', JSON.stringify(updatedBookmarks));
    return true;
  } catch (error) {
    console.error('Error removing local bookmark:', error);
    return false;
  }
};
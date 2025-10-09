"use server";

import { auth } from "@clerk/nextjs/server";
import { createSupabaseClient } from "@/lib/supabase";
import { revalidatePath } from "next/cache";

export const createCompanion = async (formData: CreateCompanion) => {
  const { userId: author } = await auth();
  const supabase = createSupabaseClient();

  const { data, error } = await supabase
    .from("companions")
    .insert({ ...formData, author })
    .select();

  if (error || !data)
    throw new Error(error?.message || "Failed to create a companion");

  return data[0];
};

export const getAllCompanions = async ({
  limit = 10,
  page = 1,
  subject,
  topic,
}: GetAllCompanions) => {
  const supabase = createSupabaseClient();

  // Use a simple string without comments or multi-line formatting
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
    // Return empty array instead of throwing to prevent page crash
    return [];
  }

  // Add default bookmarked value if the column doesn't exist
  return (
    companions?.map((companion) => ({
      ...companion,
      bookmarked: false, // Default value
    })) || []
  );
};

export const getCompanion = async (id: string) => {
  const supabase = createSupabaseClient();

  // First try to find by UUID (normal ID)
  let { data, error } = await supabase.from("companions").select().eq("id", id);

  // If not found by UUID, try to find by name slug
  if (!data || data.length === 0 || error) {
    const { data: slugData, error: slugError } = await supabase
      .from("companions")
      .select()
      .ilike("name", `%${id.replace(/-/g, " ")}%`); // Convert "my-journey" to "my journey"

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
};

export const addToSessionHistory = async (companionId: string) => {
  const { userId } = await auth();
  const supabase = createSupabaseClient();
  const { data, error } = await supabase.from("session_history").insert({
    companion_id: companionId,
    user_id: userId,
  });

  if (error) throw new Error(error.message);

  return data;
};

export const getRecentSessions = async (limit = 10) => {
  const supabase = createSupabaseClient();
  const { data, error } = await supabase
    .from("session_history")
    .select(`companions:companion_id (*)`)
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error) throw new Error(error.message);

  // Remove duplicate companions by ID
  const uniqueCompanions = data.reduce((acc, { companions }) => {
    if (companions && !acc.find((comp) => comp.id === companions.id)) {
      acc.push(companions);
    }
    return acc;
  }, []);

  return uniqueCompanions;
};

export const getUserSessions = async (userId: string, limit = 10) => {
  const supabase = createSupabaseClient();
  const { data, error } = await supabase
    .from("session_history")
    .select(`companions:companion_id (*)`)
    .eq("user_id", userId)
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error) throw new Error(error.message);

  return data.map(({ companions }) => companions);
};

export const getUserCompanions = async (userId: string) => {
  const supabase = createSupabaseClient();
  const { data, error } = await supabase
    .from("companions")
    .select()
    .eq("author", userId);

  if (error) throw new Error(error.message);

  return data;
};

export const newCompanionPermissions = async () => {
  const { userId, has } = await auth();

  // If no user, they can't create companions
  if (!userId) return false;

  const supabase = createSupabaseClient();

  let limit = 5; // Default free tier limit should be 5, not 0

  // Check for Pro plan first (unlimited)
  if (has({ plan: "pro_companion" })) {
    return true;
  }
  // Check for Core Learner plan (10 companions)
  else if (has({ plan: "core_learner" })) {
    limit = 10;
  }
  // Check for specific features if plans don't work
  else if (has({ feature: "unlimited_companions" })) {
    return true;
  } else if (has({ feature: "10_companions_limit" })) {
    limit = 10;
  } else if (has({ feature: "5_companions_limit" })) {
    limit = 5; // This should be 5, not 3
  }
  // Default (free/Basic plan) is already set to 5

  const { data, error } = await supabase
    .from("companions")
    .select("id", { count: "exact" })
    .eq("author", userId);

  if (error) throw new Error(error.message);

  const companionCount = data?.length || 0;

  // Return true if user hasn't reached their limit, false if they have
  return companionCount < limit;
};

// Bookmarks
export const addBookmark = async (companionId: string, path: string) => {
  const { userId } = await auth();
  if (!userId) return;
  const supabase = createSupabaseClient();
  const { data, error } = await supabase.from("bookmarks").insert({
    companion_id: companionId,
    user_id: userId,
  });
  if (error) {
    throw new Error(error.message);
  }
  // Revalidate the path to force a re-render of the page

  revalidatePath(path);
  return data;
};

export const removeBookmark = async (companionId: string, path: string) => {
  const { userId } = await auth();
  if (!userId) return;
  const supabase = createSupabaseClient();
  const { data, error } = await supabase
    .from("bookmarks")
    .delete()
    .eq("companion_id", companionId)
    .eq("user_id", userId);
  if (error) {
    throw new Error(error.message);
  }
  revalidatePath(path);
  return data;
};

// It's almost the same as getUserCompanions, but it's for the bookmarked companions
export const getBookmarkedCompanions = async (userId: string) => {
  const supabase = createSupabaseClient();
  const { data, error } = await supabase
    .from("bookmarks")
    .select(`companions:companion_id (*)`) // Notice the (*) to get all the companion data
    .eq("user_id", userId);
  if (error) {
    throw new Error(error.message);
  }
  // We don't need the bookmarks data, so we return only the companions
  return data.map(({ companions }) => companions);
};

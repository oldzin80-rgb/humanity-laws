export type PodcastMomentEventType =
  | "podcast_entered"
  | "episode_played"
  | "podcast_reflection_saved"
  | "podcast_discussed";

export interface PodcastEpisode {
  id: string;
  title: string;
  theme: string;
  reflectionPrompt: string;
  humanityLawsConnection: string;
  status: "reviewed_placeholder" | "published";
}

export interface PodcastMomentEvent {
  userId: string;
  type: PodcastMomentEventType;
  source: "podcast";
  episode: PodcastEpisode;
  userOutput?: string;
  createdAt: string;
  companionVisible: true;
  userOwned: true;
  editableByUser: true;
  deletableByUser: true;
  purpose: "listening_reflection_discussion_and_remembrance";
}

export interface PodcastExperience {
  path: readonly ["Listen", "Reflect", "Discuss", "Remember"];
  featuredEpisode: PodcastEpisode;
  sections: readonly ["Featured Episode", "Founder Voice", "Continue Listening", "Discuss with Adam & Eve"];
  noFakeActivity: true;
  noNoisyFeed: true;
  adamEveConnected: true;
}

export const FeaturedPodcastEpisode: PodcastEpisode = {
  id: "founder-voice-placeholder-001",
  title: "Founder Voice: The Work of Becoming",
  theme: "A calm reflection on truth, stewardship, gratitude, and daily return.",
  reflectionPrompt: "What is one sentence from your life right now that deserves more honest attention?",
  humanityLawsConnection: "Connects the book, Spark, The Table, and Adam & Eve through reflection and remembrance.",
  status: "reviewed_placeholder",
};

export function createPodcastExperience(): PodcastExperience {
  return {
    path: ["Listen", "Reflect", "Discuss", "Remember"],
    featuredEpisode: FeaturedPodcastEpisode,
    sections: ["Featured Episode", "Founder Voice", "Continue Listening", "Discuss with Adam & Eve"],
    noFakeActivity: true,
    noNoisyFeed: true,
    adamEveConnected: true,
  };
}

export function createPodcastMomentEvent(params: {
  userId: string;
  type: PodcastMomentEventType;
  episode?: PodcastEpisode;
  userOutput?: string;
  createdAt?: string;
}): PodcastMomentEvent {
  return {
    userId: params.userId,
    type: params.type,
    source: "podcast",
    episode: params.episode ?? FeaturedPodcastEpisode,
    userOutput: params.userOutput,
    createdAt: params.createdAt ?? new Date().toISOString(),
    companionVisible: true,
    userOwned: true,
    editableByUser: true,
    deletableByUser: true,
    purpose: "listening_reflection_discussion_and_remembrance",
  };
}

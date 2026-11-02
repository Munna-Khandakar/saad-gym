"use client";

import { createContext, useContext } from "react";

import { DEFAULT_LEVEL_ID } from "@/data/workouts";
import type { LevelId } from "@/types/workout";

/*
 * Level colours come from a [data-level] ancestor (see globals.css). Dialogs
 * portal into <body>, outside that ancestor, so they read the level from here
 * and set `data-level` on their own content.
 */
const LevelContext = createContext<LevelId>(DEFAULT_LEVEL_ID);

export const LevelProvider = LevelContext.Provider;

export function useLevel(): LevelId {
  return useContext(LevelContext);
}

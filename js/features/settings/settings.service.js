import { appState, exportStateSnapshot, replaceStateFromSnapshot, saveState } from "../../state.js";
import { getCurrentUser } from "../../supabase/auth.js";
import { ensureUserRows, uploadLocalState, downloadCloudState } from "../../supabase/db.js";

export async function getAuthUser() {
  return await getCurrentUser();
}

export async function initializeCloudRows() {
  const user = await getCurrentUser();
  if (!user) throw new Error("로그인이 필요해요.");
  await ensureUserRows(user, appState);
  return user;
}

export async function uploadCurrentNest() {
  const user = await getCurrentUser();
  if (!user) throw new Error("로그인이 필요해요.");
  await uploadLocalState(user, exportStateSnapshot());
  return user;
}

export async function downloadNestToLocal() {
  const user = await getCurrentUser();
  if (!user) throw new Error("로그인이 필요해요.");
  const cloudState = await downloadCloudState(user, exportStateSnapshot());
  replaceStateFromSnapshot(cloudState);
  saveState();
  return cloudState;
}

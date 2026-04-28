import { qs, on, showToast } from "../../utils/dom.js";
import { signUpWithEmail, signInWithEmail, signOut, getCurrentUser, onAuthStateChange } from "../../supabase/auth.js";
import { initializeCloudRows, uploadCurrentNest, downloadNestToLocal } from "./settings.service.js";

let authListenerBound = false;

export function bindSettingsEvents(renderApp) {
  refreshCurrentUser(renderApp);

  if (!authListenerBound) {
    onAuthStateChange((user) => {
      window.kiwiCurrentUser = user;
      renderApp();
    });
    authListenerBound = true;
  }

  on(qs("#signUpButton"), "click", async () => {
    const { email, password } = getAuthInput();
    if (!email || !password) return showToast("이메일과 비밀번호를 입력해 주세요.");

    await runAsync(async () => {
      await signUpWithEmail(email, password);
      const user = await getCurrentUser();
      window.kiwiCurrentUser = user;
      if (user) await initializeCloudRows();
      showToast("회원가입 완료! 메일 확인이 필요할 수 있어요.");
      renderApp();
    });
  });

  on(qs("#signInButton"), "click", async () => {
    const { email, password } = getAuthInput();
    if (!email || !password) return showToast("이메일과 비밀번호를 입력해 주세요.");

    await runAsync(async () => {
      await signInWithEmail(email, password);
      const user = await getCurrentUser();
      window.kiwiCurrentUser = user;
      if (user) await initializeCloudRows();
      showToast("로그인했어요. 둥지가 구름에 연결됐어요 ☁️");
      renderApp();
    });
  });

  on(qs("#signOutButton"), "click", async () => {
    await runAsync(async () => {
      await signOut();
      window.kiwiCurrentUser = null;
      showToast("로그아웃했어요.");
      renderApp();
    });
  });

  on(qs("#uploadCloudButton"), "click", async () => {
    const ok = window.confirm("현재 브라우저의 둥지 데이터를 Supabase에 업로드할까요? 기존 클라우드 데이터는 이 내용으로 교체돼요.");
    if (!ok) return;

    await runAsync(async () => {
      await uploadCurrentNest();
      showToast("현재 둥지를 클라우드에 저장했어요 ☁️");
      renderApp();
    });
  });

  on(qs("#downloadCloudButton"), "click", async () => {
    const ok = window.confirm("Supabase 데이터를 현재 브라우저에 불러올까요? 현재 로컬 데이터는 클라우드 데이터로 교체돼요.");
    if (!ok) return;

    await runAsync(async () => {
      await downloadNestToLocal();
      showToast("클라우드 둥지를 불러왔어요 🥝");
      renderApp();
    });
  });
}

async function refreshCurrentUser(renderApp) {
  const user = await getCurrentUser().catch(() => null);
  if (window.kiwiCurrentUser?.id !== user?.id) {
    window.kiwiCurrentUser = user;
    renderApp();
  }
}

function getAuthInput() {
  return {
    email: qs("#authEmail")?.value.trim() ?? "",
    password: qs("#authPassword")?.value ?? "",
  };
}

async function runAsync(fn) {
  try {
    await fn();
  } catch (error) {
    console.error(error);
    showToast(error.message || "작업 중 오류가 났어요.");
  }
}

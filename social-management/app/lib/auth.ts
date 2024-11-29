export function getUserIdFromCookies(): string | null {
    const cookies = document.cookie.split("; ");
    const userCookie = cookies.find((row) => row.startsWith("user_id="));
    return userCookie ? userCookie.split("=")[1] : null;
  }  
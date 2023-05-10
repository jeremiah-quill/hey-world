import "@/styles/globals.css";
import Head from "next/head";
import { SessionProvider } from "next-auth/react";
import { UserSettingsProvider } from "@/context/userSettingsContext";
import { ToastProvider } from "@/context/toastContext";
import { ModalProvider } from "@/context/modalContext";
import { Analytics } from "@vercel/analytics/react";

export default function App({
  Component,
  pageProps: { session, ...pageProps },
}) {
  return (
    <>
      <Head>
        <title>hey world.</title>
        <link
          rel="icon"
          href="data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>✌️</text></svg>"
        />
      </Head>
      <SessionProvider session={session}>
        <UserSettingsProvider>
          <ToastProvider>
            <ModalProvider>
              <Component {...pageProps} />
            </ModalProvider>
          </ToastProvider>
        </UserSettingsProvider>
      </SessionProvider>
      <Analytics />
    </>
  );
}

import "../styles/globals.scss";
import "regenerator-runtime/runtime";
import { QueryClient, QueryClientProvider } from "react-query";
import AuthContextProvider from "@contexts/AuthContext";
import TeamContextProvider from "@contexts/TeamContext";
import TokensContextProvider from "@contexts/TokensContext";
import FavouritesContextProvider from "@contexts/FavouritesContext";
import AppLayout from "@layouts/AppLayout";
import AppContextProvider from "@contexts/AppContext";
import SSRProvider from "react-bootstrap/SSRProvider";
import NextNProgress from "nextjs-progressbar";
import NotificationPopup from "@components/alert/NotificationPopup";
import Error from "@ui-library/Error";
import { Auth0Provider } from "@auth0/auth0-react";
import Script from "next/script";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: false,
    },
  },
});

function App({ Component, pageProps }) {
  const domain = "https://dev-j1x568vearhy5cqy.us.auth0.com";
  const clientId = "hUPJuzrSUfmJ4OAjJcVQY2lfOeFuiVDh";
  return (
    <QueryClientProvider client={queryClient}>
      <NextNProgress color="#81c2c0" />
      <Auth0Provider domain={domain} clientId={clientId}>
        <AuthContextProvider>
          <TeamContextProvider>
            <AppContextProvider>
              <NotificationPopup />
              <FavouritesContextProvider>
                <SSRProvider>
                  <Error />
                  <AppLayout>
                    <Component {...pageProps} />
                    <Script src="https://js.live.net/v7.2/OneDrive.js" />
                  </AppLayout>
                </SSRProvider>
              </FavouritesContextProvider>
            </AppContextProvider>
          </TeamContextProvider>
        </AuthContextProvider>
      </Auth0Provider>

      {/* <ReactQueryDevtools initialIsOpen={false} /> */}
    </QueryClientProvider>
  );
}

export default App;

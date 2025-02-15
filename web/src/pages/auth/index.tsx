import { useEffect } from "react";
import { Center, Spinner } from "@chakra-ui/react";
import { useMutation } from "@tanstack/react-query";
import { createSealosApp, sealosApp } from "@zjy365/sealos-desktop-sdk/app";

import useSessionStore from "./store";

import { AuthenticationControllerSignin } from "@/apis/v1/auth";

const AuthPage = () => {
  const { session, setSession, getKubeconfig, getNamespace } = useSessionStore();

  useEffect(() => {
    return createSealosApp();
  }, []);

  useEffect(() => {
    const initApp = async () => {
      const result = await sealosApp.getSession();
      setSession(result);
    };
    initApp();
  }, []);

  const { mutateAsync: signin } = useMutation(["signin"], () => {
    return AuthenticationControllerSignin({
      username: session.user.name,
      namespace: getNamespace(),
      kubeconfig: getKubeconfig(),
    });
  });

  useEffect(() => {
    const localNamespace = localStorage.getItem("sealos-namespace");
    const localToken = localStorage.getItem("token");
    const namespace = getNamespace();

    if (session.user && namespace && localNamespace !== namespace) {
      signin().then((res) => {
        localStorage.setItem("token", res?.data.token);
        localStorage.setItem("sealos-namespace", namespace);
        window.location.href = "/dashboard";
      });
    } else if (localToken && namespace && localNamespace === namespace) {
      window.location.href = "/dashboard";
    }
  }, [session]);

  return (
    <Center w="100vw" h="100vh">
      <Spinner></Spinner>
    </Center>
  );
};

export default AuthPage;

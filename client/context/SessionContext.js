'use client';
import { createContext, useContext, useState, useEffect } from 'react';
import auth from '@/Firebase';
import Cookies from 'js-cookie';
import { GoogleAuthProvider, GithubAuthProvider, signInWithPopup, getAdditionalUserInfo, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, onAuthStateChanged } from "firebase/auth";
import { useRouter } from 'next/navigation';

const googleProvider = new GoogleAuthProvider();
const githubProvider = new GithubAuthProvider();

const SessionContext = createContext();

export const SessionProvider = ({ children }) => {

  const router = useRouter()

  const [profile, setProfile] = useState(null);
  const [user, setUser] = useState(null);

  const debounce = (func, delay) => {
    let timeout;
    return (...args) => {
      clearTimeout(timeout);
      timeout = setTimeout(() => func(...args), delay);
    };
  };


  useEffect(() => {

    const debouncedAuthHandler = debounce((currentUser) => {
      if (currentUser) {
        Cookies.set('userStatus', btoa(currentUser.uid), { secure: true, sameSite: 'strict' });
        setUser(currentUser);
      } else {
        Cookies.remove('userStatus');
        setUser(null);
        setProfile(null);
      }
    }, 500);

    const unsubscribe = onAuthStateChanged(auth, debouncedAuthHandler);

    return () => {
      unsubscribe();
    };
  }, []);


  const fetchProfile = async () => {
    try {
      if (!user?.uid) {
        console.error('User not set. Skipping profile fetch.');
        return {
          success: false,
          message: "User not found!"
        }
      }

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/api/user/get-user`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'x-uid': user.uid,
          },
        }
      );
      const result = await response.json();

      if (result.success) {
        setProfile(result.userData);
        return {
          success: true,
          message: result.message
        }
      }
      else {
        setProfile(null)
        console.error('Profile fetch failed. Signing out...');
        handleSignOut()
        return {
          success: false,
          message: result.message
        }
      }
    }
    catch (err) {
      setProfile(null)
      console.error('Error fetching profile:', err);
      handleSignOut()
      return {
        success: false,
        message: "Profile fetch failed!!"
      }
    }
  };

  useEffect(() => {
    const userStatus = Cookies.get('userStatus');
    if (userStatus) {
      const fetchUserProfile = async () => {
        if (!user) return;
        const profileFetchResult = await fetchProfile();
        if (!profileFetchResult.success) {
          handleSignOut();
        }
      };
      fetchUserProfile();
    }
  }, [user?.uid]);

  const handleSignOut = async () => {
    try {
      setUser(null);
      setProfile(null);
      Cookies.remove('userStatus');
      await signOut(auth);
      router.push('/')
    }
    catch (error) {
      console.error("Error during sign out:", error);
    }
  };

  // Firebase Sign Up and Sign In Methods

  const signInWithGoogle = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;
      const additionalUserInfo = getAdditionalUserInfo(result);

      if (additionalUserInfo.isNewUser) {
        try {
          const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/user/create-user`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              uid: user.uid,
              email: user.email,
              username: "google_" + user.email.split("@")[0],
              name: user.displayName || "",
              photoURL: user.photoURL || "",
              emailVerified: user.emailVerified,
              provider: user.providerData[0].providerId
            }),
          });
          const result = await response.json()

          if (result.success) {
            setProfile(result.userData)
            return {
              success: true,
              message: result.message
            }
          }
          else {
            handleSignOut()
            return {
              success: false,
              message: result.message
            }
          }
        }
        catch (err) {
          handleSignOut()
          console.error("Error creating user: ", err)
          return {
            success: false,
            message: "Error Signing In With Google!"
          }
        }
      }
      return {
        success: true,
        message: "Signed In With Google !"
      }
    }
    catch (error) {
      handleSignOut()
      console.error("Error signing in with Google:", error.message);
      return {
        success: false,
        message: "Error Signing in with Google!"
      }
    }
  };

  const signInWithGithub = async () => {
    try {
      const result = await signInWithPopup(auth, githubProvider);
      const user = result.user;
      const additionalUserInfo = getAdditionalUserInfo(result);

      if (additionalUserInfo.isNewUser) {
        try {
          const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/user/create-user`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json"
            },
            body: JSON.stringify({
              uid: user.uid,
              email: user.email,
              username: "github_" + (user?.username || additionalUserInfo?.username || user.email.split("@")[0]),
              name: user.displayName || "",
              photoURL: user.photoURL || "",
              emailVerified: user.emailVerified,
              provider: user.providerData[0].providerId
            }),
          });
          const result = await response.json()

          if (result.success) {
            setProfile(result.userData)
            return {
              success: true,
              message: result.message
            }
          }
          else {
            handleSignOut()
            return {
              success: false,
              message: result.message
            }
          }
        }
        catch (err) {
          handleSignOut()
          console.error("Error creating user: ", err)
          return {
            success: false,
            message: "Error Signing In With Github!"
          }
        }
      }
      return {
        success: true,
        message: "Signed In With GitHub !"
      }
    }
    catch (error) {
      handleSignOut()
      console.error("Error signing in with GitHub:", error.message);
      return {
        success: false,
        message: "Error Signing In With Github!"
      }
    }
  };

  const signUpWithEmail = async (credentials) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, credentials.email, credentials.password);
      const user = userCredential.user;

      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/user/create-user`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            uid: user.uid,
            email: user.email,
            username: credentials.username,
            name: credentials.name,
            emailVerified: user.emailVerified,
            provider: user.providerData[0].providerId
          }),
        });
        const result = await response.json()

        if (result.success) {
          setProfile(result.userData)
          return {
            success: true,
            message: result.message
          }
        }
        else {
          handleSignOut()
          return {
            success: false,
            message: result.message
          }
        }

      }
      catch (err) {
        console.error("Error creating user: ", err)
        handleSignOut()
        return {
          success: false,
          message: "Error Signing Up With Email!"
        }
      }
    }
    catch (error) {
      handleSignOut()
      console.error("Error signing up with email:", error.message);
      if (error.code === 'auth/email-already-in-use') {
        return {
          success: false,
          message: "Email Address Is Already In Use!"
        }
      }
      else if (error.code === "auth/network-request-failed") {
        return {
          success: false,
          message: "Network Error. Please try again after reconnecting.",
        };
      }
      else {
        return {
          success: false,
          message: "Error Signing Up With Email!"
        }
      }
    }
  };

  const signInWithEmail = async (credentials) => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, credentials.email, credentials.password);
      return {
        success: true,
        message: "Signed In Successfully !"
      }
    }
    catch (error) {
      if (error.code === 'auth/user-not-found') {
        return {
          success: false,
          message: "No account found with the provided email address. !"
        }
      }
      else if (error.code === "auth/wrong-password") {
        return {
          success: false,
          message: "Incorrect password. Please try again.",
        };
      }
      else if (error.code === "auth/invalid-credential") {
        return {
          success: false,
          message: "Incorrect credentials. Please try again.",
        };
      }
      else if (error.code === "auth/network-request-failed") {
        return {
          success: false,
          message: "Network Error. Please try again after reconnecting.",
        };
      }
      else {
        console.error("Error signing in with email:", error.message);
        return {
          success: false,
          message: "Error Signing In With Email!"
        }
      }
    }
  };


  return (
    <SessionContext.Provider
      value={{
        user,
        profile,
        setProfile,
        signInWithEmail,
        signUpWithEmail,
        signInWithGithub,
        signInWithGoogle,
        handleSignOut,
      }}
    >
      {children}
    </SessionContext.Provider>
  );
};

export const useSession = () => {
  return useContext(SessionContext);
};

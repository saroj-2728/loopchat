'use client';
import { createContext, useContext, useState, useEffect } from 'react';
import auth from '@/Firebase';
import Cookies from 'js-cookie';
import { GoogleAuthProvider, GithubAuthProvider, signInWithPopup, getAdditionalUserInfo, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, onAuthStateChanged } from "firebase/auth";

const googleProvider = new GoogleAuthProvider();
const githubProvider = new GithubAuthProvider();

const SessionContext = createContext();

export const SessionProvider = ({ children }) => {
  const [profile, setProfile] = useState(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [profileCreated, setProfileCreated] = useState(false)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        setUser((prevUser) => {
          if (prevUser?.uid !== currentUser?.uid) {
            Cookies.set('userStatus', btoa(currentUser.uid), {
              secure: true,
              sameSite: 'strict',
            });
            return currentUser;
          }
          return prevUser;
        });
      } else {
        Cookies.remove('userStatus');
        setUser(null);
        setProfile(null)
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);


  useEffect(() => {
    const fetchProfile = async () => {
      try {
        if (!user?.uid) return;

        setLoading(true);
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
        } else {
          setProfile(null)
          console.error('Profile fetch failed. Signing out...');
          await signOut(auth);
        }
      } catch (err) {
        setProfile(null)
        console.error('Error fetching profile:', err);
        await signOut(auth);
      } finally {
        setLoading(false);
        setProfileCreated(false)
      }
    };
    if (user?.uid && profileCreated)
      fetchProfile();
  }, [user?.uid, profileCreated]);


  useEffect(() => {
    const userStatus = Cookies.get('userStatus')
    if (userStatus)
      setProfileCreated(true)
  }, [])



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
            setProfileCreated(true)
            return {
              success: true,
              message: result.message
            }
          }
          else {
            await signOut(auth);
            return {
              success: false,
              message: result.message
            }
          }
        } catch (err) {
          await signOut(auth);
          console.error("Error creating user: ", err)
          return {
            success: false,
            message: "Error Signing In With Google!"
          }
        }
      }

      setProfileCreated(true)

      return {
        success: true,
        message: "Signed In With Google"
      }

    } catch (error) {
      await signOut(auth);
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
            headers: { "Content-Type": "application/json" },
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
            setProfileCreated(true)
            return {
              success: true,
              message: result.message
            }
          }
          else {
            await signOut(auth);
            return {
              success: false,
              message: result.message
            }
          }
        } catch (err) {
          await signOut(auth);
          console.error("Error creating user: ", err)
          return {
            success: false,
            message: "Error Signing In With Github!"
          }
        }
      }

      setProfileCreated(true)

      return {
        success: true,
        message: "Signed In With Github"
      }

    } catch (error) {
      await signOut(auth)
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
          setProfileCreated(true)
          return {
            success: true,
            message: result.message
          }
        }
        else {
          await signOut(auth);
          return {
            success: false,
            message: result.message
          }
        }

      } catch (err) {
        await signOut(auth);
        console.error("Error creating user: ", err)
        await signOut(auth);
        return {
          success: false,
          message: "Error Signing Up With Email!"
        }
      }
    } catch (error) {
      await signOut(auth);
      console.error("Error signing up with email:", error.message);
      if (error.code === 'auth/email-already-in-use') {
        return {
          success: false,
          message: "Email Address Is Already In Use!"
        }
      } else {
        return {
          success: false,
          message: "Error Signing Up With Email!"
        }
      }
    }
  };

  const signInWithEmail = async (email, password) => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);

      setProfileCreated(true)

      return {
        success: true,
        message: "Signed In With Email"
      }

    } catch (error) {
      if (error.code === 'auth/invalid-value-(email),-starting-an-object-on-a-scalar-field') {
        return {
          success: false,
          message: "Invalid Email Address!"
        }
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
    <SessionContext.Provider value={{ user, profile, setProfile, loading, signInWithEmail, signUpWithEmail, signInWithGithub, signInWithGoogle }}>
      {children}
    </SessionContext.Provider>
  );
};

export const useSession = () => {
  return useContext(SessionContext);
};

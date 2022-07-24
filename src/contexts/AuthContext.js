import React, { useContext, useState, useEffect } from 'react'
import { onAuthStateChanged, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from 'firebase/auth'
import { auth, db } from '../firebase'
import { doc, getDoc } from "firebase/firestore";

const AuthContext = React.createContext()

export function useAuth() {
    return useContext(AuthContext)
}

export default function AuthProvider({ children }) {
    const [currentUser, setCurrentUser] = useState()
    const [loading, setLoading] = useState(true)
    const [ userData, setUserData ] = useState();


    function signup(email, password) {
        return createUserWithEmailAndPassword(auth, email, password)
    }

    function login(email, password) {
        return signInWithEmailAndPassword(auth, email, password)
    }

    function logout() {
        return signOut(auth)
    }
    
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, user =>  {

            setCurrentUser(user)

            const fetchData = async () => {
                try {
                    const docRef = doc(db, "users", user.uid);
                    const docSnap = await getDoc(docRef);
                    // console.log("parsing data", user)
                    if (docSnap.exists()) {
                        // console.log("done parsing");
                        const docData = docSnap.data();
                        // console.log(docData);
                        setUserData(docData);
                        return docData;
                    } else {
                    // doc.data() will be undefined in this case
                        console.log("Error! No such document!");
                        setUserData(null);
                        return null;
                    }
                // }
                } catch (error) {
                console.log(error);
                }
            }
            const promisedData = fetchData();
            // fetchData returns a promise which has to be resolved if not the routing will not work properly
            promisedData.then((fetchedData) => {
                setUserData(fetchedData);
                // console.log(fetchedData);
            })
            setLoading(false);
        })

        return unsubscribe
    }, [])

    const value = {
        currentUser,
        loading,
        userData,
        setUserData,
        signup,
        login,
        logout
    }

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    )
}

import { doc, getDoc, setDoc, onSnapshot } from 'firebase/firestore';
import { signInAnonymously, onAuthStateChanged } from 'firebase/auth';
import { db, auth } from './config';

export const initializeAuth = () => {
    return new Promise((resolve, reject) => {
        onAuthStateChanged(auth, async (user) => {
            if (user) {
                resolve(user.uid);
            } else {
                try {
                    const userCredential = await signInAnonymously(auth);
                    resolve(userCredential.user.uid);
                } catch (error) {
                    console.error('Anonymous auth failed:', error);
                    reject(error);
                }
            }
        });
    });
};

export const loadTabs = async (userId) => {
    try {
        const docRef = doc(db, 'users', userId, 'tabs', 'config');
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            return docSnap.data().tabs;
        }

        return null;
    } catch (error) {
        console.error('Error loading tabs:', error);
        return null;
    }
};

export const initializeNewUser = async (userId, defaultTabs) => {
    try {
        const docRef = doc(db, 'users', userId, 'tabs', 'config');
        await setDoc(docRef, {
            tabs: defaultTabs.map(({ icon, ...rest }) => rest),
            lastUpdated: new Date().toISOString(),
            isInitialized: true
        });
        console.log('New user initialized with default tabs');
        return true;
    } catch (error) {
        console.error('Error initializing new user:', error);
        return false;
    }
};

export const saveTabs = async (userId, tabs) => {
    try {
        const docRef = doc(db, 'users', userId, 'tabs', 'config');
        await setDoc(docRef, {
            tabs: tabs.map(({ icon, ...rest }) => rest),
            lastUpdated: new Date().toISOString()
        });
        return true;
    } catch (error) {
        console.error('Error saving tabs:', error);
        return false;
    }
};

export const subscribeToTabs = (userId, callback) => {
    const docRef = doc(db, 'users', userId, 'tabs', 'config');

    return onSnapshot(docRef, (doc) => {
        if (doc.exists()) {
            callback(doc.data().tabs);
        }
    }, (error) => {
        console.error('Error subscribing to tabs:', error);
    });
};

export const migrateFromLocalStorage = async (userId) => {
    try {
        const localData = localStorage.getItem('tabs-layout');
        if (localData) {
            const tabs = JSON.parse(localData);
            await saveTabs(userId, tabs);
            localStorage.removeItem('tabs-layout');
            console.log('Successfully migrated tabs from localStorage to Firebase');
            return true;
        }
        return false;
    } catch (error) {
        console.error('Error migrating from localStorage:', error);
        return false;
    }
};

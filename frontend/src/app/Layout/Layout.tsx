import {Outlet, useLocation} from 'react-router-dom';
import {AnimatePresence, motion} from 'framer-motion';

import {Sidebar} from "@/widgets/sidebar/Sidebar.tsx";

import styles from './Layout.module.css'

export function Layout() {
    const location = useLocation()
    return (
        <div className={styles.shell}>
            <Sidebar/>
            <main className={styles.content}>
                <AnimatePresence mode={"wait"}>
                    <motion.div
                        key={location.pathname}
                        initial={{opacity: 0, y: 8}}
                        animate={{opacity: 1, y: 0}}
                        exit={{opacity: 0, y: -8}}
                        transition={{duration: 0.2}}
                    >
                        <Outlet/>
                    </motion.div>
                </AnimatePresence>
            </main>
        </div>
    )
}
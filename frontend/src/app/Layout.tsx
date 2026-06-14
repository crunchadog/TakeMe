import {Outlet, useLocation} from 'react-router-dom';
import {AnimatePresence, motion} from 'framer-motion';

import {Header} from '@/widgets/header/Header';

export function Layout() {
    const location = useLocation()
    console.log(location)
    return (
        <div>
            <Header/>
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
        </div>
    )
}
import {useEffect} from 'react';
import {useLocation} from 'react-router-dom';

/*
    import ScrollTopOnMount from "./components/globalScrollTopOnMount";
    滚动至顶部组件
    <ScrollTopOnMount />
*/

export default function GlobalScrollTop(props) {

    const pathName = useLocation()
    useEffect(() => {
        window.scrollTo(0,0)
    }, [])

    return null

}
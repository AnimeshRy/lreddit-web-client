import type { NextPage } from 'next'
import { NavBar } from '../components/Navbar'

const Home: NextPage = () => {
    return (
        <>
            <NavBar />
            <p>Hello World</p>
        </>
    )
}

export default Home

import type { NextPage } from 'next'
import { withUrqlClient } from 'next-urql'
import { NavBar } from '../components/Navbar'
import { usePostsQuery } from '../generated/graphql'
import { createUrqlClient } from '../utils/createUrqlClient'

const Index: NextPage = () => {
    const [{ data }] = usePostsQuery();
    return (
        <>
            <NavBar />
            <p>Hello World</p>
            {!data ? null : data.posts.map((p) => <div key={p.id}>{p.title}</div>)}
        </>
    )
}

// Component is Server Side Rendered on the first Time
export default withUrqlClient(createUrqlClient, { ssr: true })(Index)

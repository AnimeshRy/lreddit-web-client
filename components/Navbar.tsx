import { Box, Button, Flex, Link } from "@chakra-ui/react"
import NextLink from 'next/link'
import { useLogoutMutation, useMeQuery } from "../generated/graphql"
import { isServer } from "../utils/isServer"

interface NavBarProps {

}

export const NavBar: React.FC<NavBarProps> = ({ }) => {
    const [{ fetching: logoutFetching }, logout] = useLogoutMutation()
    const [{ data, fetching }] = useMeQuery({
        pause: isServer() // does not Server side render Me query as we are on the index page, it only works on client
    })
    let body = null;

    // data is loading
    if (fetching) {

        // body = null;
    } // user not logged in
    else if (!data?.me) {
        body = (
            <>
                <NextLink href="/login" passHref>
                    <Link mr={2}>login</Link>
                </NextLink>
                <NextLink href="/register" passHref>
                    <Link>register</Link>
                </NextLink>
            </>
        )
    } else {
        body = (
            <Flex>
                <Box mr={2}>{data.me.username}</Box>
                <Button variant='link' onClick={() => {
                    logout();
                }}
                    isLoading={logoutFetching}
                >logout</Button>
            </Flex>
        )
    }

    return (
        <Flex bg="tomato" p={4}>
            <Box ml={"auto"}>
                {body}
            </Box>
        </Flex>
    )
}

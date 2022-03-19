import type { NextPage } from 'next'
import { Formik, Form } from 'formik';
import { Box, Button, Flex, Link } from '@chakra-ui/react';
import { Wrapper } from '../components/Wrapper';
import InputField from '../components/InputField';
import { useLoginMutation } from '../generated/graphql';
import { toErrorMap } from '../utils/toErrorMap';
import { useRouter } from 'next/router';
import { withUrqlClient } from 'next-urql';
import NextLink from 'next/link'
import { createUrqlClient } from '../utils/createUrqlClient';



const Login: NextPage<{}> = ({ }) => {

    const [, login] = useLoginMutation()
    const router = useRouter()
    return (
        <Wrapper variant="small">
            <Formik initialValues={{
                usernameOrEmail: "", password: ""
            }}
                onSubmit={async (values, { setErrors }) => {
                    const response = await login(values);
                    if (response.data?.login.errors) {
                        setErrors(toErrorMap(response.data.login.errors))
                    } else if (response.data?.login.user) {
                        // worked ?
                        router.push("/")
                    }
                }}
            >
                {({ isSubmitting }) => (
                    <Form>
                        <InputField
                            name="usernameOrEmail"
                            placeholder="username or email"
                            label="Username or Email"
                        />
                        <Box mt={4}>
                            <InputField
                                name="password"
                                placeholder="password"
                                label="Password"
                                type="password"
                            />
                        </Box>
                        <Flex mt={2}>
                            <NextLink href="/forgot-password" passHref>
                                <Link ml="auto">forgot password?</Link>
                            </NextLink>
                        </Flex>
                        <Button
                            mt={4} type="submit" isLoading={isSubmitting}
                            colorScheme="teal">login</Button>
                    </Form>
                )}
            </Formik>
        </Wrapper >
    )
}

export default withUrqlClient(createUrqlClient)(Login)

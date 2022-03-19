import { Box, Button, Link } from "@chakra-ui/react";
import { Formik, Form } from "formik";
import { NextPage } from "next"
import { withUrqlClient } from "next-urql";
import NextLink from "next/link";
import router, { useRouter } from "next/router";
import { useState } from "react";
import InputField from "../../components/InputField";
import { Wrapper } from "../../components/Wrapper";
import { useChangePasswordMutation } from "../../generated/graphql";
import { createUrqlClient } from "../../utils/createUrqlClient";
import { toErrorMap } from "../../utils/toErrorMap";

interface ChangePasswordProps {
    token: string
}

export const ChangePassword: NextPage<ChangePasswordProps> = ({ token }) => {
    const router = useRouter();
    const [, changePassword] = useChangePasswordMutation()
    const [tokenError, setTokenError] = useState("")
    return (<Wrapper variant="small">
        <Formik initialValues={{ newPassword: "" }}
            onSubmit={async (values, { setErrors }) => {
                const response = await changePassword({ newPassword: values.newPassword, token });
                if (response.data?.changePassword.errors) {
                    const errorMap = toErrorMap(response.data.changePassword.errors)
                    // Token Errors
                    if ('token' in errorMap) {
                        setTokenError(errorMap.token)
                    }
                    setErrors(errorMap)
                } else if (response.data?.changePassword.user) {
                    // worked ?
                    router.push("/")
                }
            }}
        >
            {({ isSubmitting }) => (
                <Form>
                    <InputField
                        name="newPassword"
                        placeholder="new password"
                        label="New Password"
                        type="password"
                    />
                    {tokenError ? (<Box>
                        <Box color='red'>{tokenError}</Box>
                        <NextLink href="/forgot-password" passHref>
                            <Link>go forget it again</Link>
                        </NextLink>
                    </Box>) : null}
                    <Button
                        mt={4} type="submit" isLoading={isSubmitting}
                        colorScheme="teal">change password</Button>
                </Form>
            )}
        </Formik>
    </Wrapper >);
}


export async function getServerSideProps(context: any) {
    const { token } = context.query
    return {
        props: {
            token: token
        }, // will be passed to the page component as props
    }
}


export default withUrqlClient(createUrqlClient)(ChangePassword)

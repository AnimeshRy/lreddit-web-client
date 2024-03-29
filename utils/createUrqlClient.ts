import { dedupExchange, fetchExchange, ssrExchange } from "urql";
import { cacheExchange } from "@urql/exchange-graphcache";
import { LoginMutation, LogoutMutation, MeDocument, MeQuery, RegisterMutation } from "../generated/graphql";
import { betterUpdateQuery } from '../utils/betterUpdateQuery';

export const createUrqlClient = (ssrExchange: any) => ({
    url: 'http://localhost:4000/graphql',
    fetchOptions: {
        credentials: "include" as const,
    },
    exchanges: [dedupExchange, cacheExchange({
        // update the me query whenever login or register mutation takes place
        updates: {
            Mutation: {
                logout: (_result, args, cache, info) => {
                    // set meQuery to null
                    betterUpdateQuery<LogoutMutation, MeQuery>(
                        cache, { query: MeDocument }, _result, () => ({ me: null })
                    )
                },
                login: (_result, args, cache, info) => {
                    betterUpdateQuery<LoginMutation, MeQuery>(
                        cache, { query: MeDocument }, _result, (result, query) => {
                            if (result.login.errors) {
                                return query
                            } else {
                                return {
                                    me: result.login.user,
                                };
                            }
                        }
                    )
                },

                register: (_result, args, cache, info) => {
                    betterUpdateQuery<RegisterMutation, MeQuery>(
                        cache, { query: MeDocument }, _result, (result, query) => {
                            if (result.register.errors) {
                                return query
                            } else {
                                return {
                                    me: result.register.user,
                                };
                            }
                        }
                    )
                }
            }
        }
    }), ssrExchange, fetchExchange],
})

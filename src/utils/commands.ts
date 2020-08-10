import minimist from "minimist";
import * as yup from 'yup';

import { apis } from "../api";
import {Params} from "../typescript/Params";

const errorMessage = (message: string) => `Error: ${message}`;

const validateParams = async (params: Params, callback: () => Promise<any>) => {
    const fields = {
        title: yup.string(),
        description: yup.string(),
        auth: yup.string(),
        https: yup.boolean().typeError('argument "https" must be a boolean type'),
        cors: yup.string(),
        category: yup.string(),
    };

    const schema = yup.object().shape(fields);


    if (params) {

        const unexpectedKeys = Object.keys(params).filter(param => {
            return !(param in fields)
        });

        if (unexpectedKeys.length) return () => errorMessage(`unexpected argument${unexpectedKeys.length > 1 ? 's' : ''} ${unexpectedKeys.join(' ')}`)
    }


    try {
        await schema.validate(params);
    } catch (e) {
        return () => {
            return errorMessage(e.message);
        }
    }

    return callback;

};

const commands = {
    help: {
        fn: () => {
            return () => {
                const d = [
                    'clear - clearing the terminal',
                    'apis list - arguments [title, description, auth, https, cors, category]',
                    'apis random - arguments [title, description, auth, https, cors, category]',
                    'apis categories - arguments [title, description, auth, https, cors, category]',
                ];

                return d.join('\n');
            }
        }
    },
    apis: {
        list: {
            fn: async (params: Params = {}) => {

                return validateParams(params, async () => {
                    const { data } = await apis.list(params);

                    return JSON.stringify(data.entries, null, 2);
                });

            }
        },
        categories: {
            fn: async () => {
                return async () => {
                    const { data } = await apis.categories();

                    return JSON.stringify(data, null, 2);
                }
            }
        },
        random: {
            fn: async (params: Params = {}) => {
                return validateParams(params, async () => {
                    const { data } = await apis.list(params);

                    return JSON.stringify(data.entries, null, 2);
                });
            }
        }
    }
};

const commandNotFound = (command: string) => async () => {
    return errorMessage(`command "${command}" not found`);
};

const search = (array: string[], _commands: any = commands): any => {
    const item = array.shift();
    if (item && item in _commands) {
        if ('fn' in _commands[item]) {
            return _commands[item]['fn']
        }

        return search(array, _commands[item])
    }

    return false;
};

export const getCommandFn = async (command: string, defaultCommands: any = {}) => {

    const notFoundFn = commandNotFound(command);
    const {_: list, ...args} = minimist(command.split(' '));

    const fn = search(list, { ...commands, ...defaultCommands });

    return fn ? await fn(args) : notFoundFn;
};

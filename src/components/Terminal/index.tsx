import React, {FC, useEffect, useRef, useState} from "react";
import {Container, Input, InputContainer, PromptLabel} from "../../ui";
import Message from "../Message";
import Queue from "../../utils/queue";
import {getCommandFn} from "../../utils/commands";
import {ICommand} from "../../typescript/Command";

interface IProps {}

type HistoryDirectionType = 'up' | 'down';

const Terminal: FC<IProps> = () => {
    const inputRef = useRef<HTMLInputElement>({} as HTMLInputElement);
    const terminalRef = useRef<HTMLDivElement>({} as HTMLDivElement);

    const [currentCommand, setCurrentCommand] = useState<string>('');

    const [commandsHistory, setCommandsHistory] = useState<string[]>([]);

    const [historyPosition, setHistoryPosition] = useState<number | null>(null);


    const [stdOut, setStdOut] = useState<ICommand[]>([]);

    const systemCommands = {
      clear: {
          fn: () => async () => {
              setStdOut([]);
              setCommandsHistory([]);
          }
      }
    };

    const focusOnTerminal = () => {
        const isTextSelected = window.getSelection()?.type === 'Range';
        if (!isTextSelected) inputRef.current?.focus()
    };

    const clearInput = () => {
        setCurrentCommand('');
    };

    const addCommandToHistory = (command: string) => {
      setCommandsHistory(prevState => ([...prevState, command]));
    };

    const updateStdOut = (command: ICommand, toExist = true) => {
        setStdOut(prevStdOut => {
            const length = prevStdOut.length;

            if ((!length || !toExist) && command) {
                return [...prevStdOut, command]
            }

            const lastCommand = prevStdOut[length - 1];

            prevStdOut.splice(length - 1, 1, { ...lastCommand, ...command });

            return [...prevStdOut];
        })
    };

    const promiseWrapper = (command: string) => async (callback: () => Promise<any> | any) => {

        const wrapper = () => {
            updateStdOut({ name: command }, false);

            const res = callback();

            if (res instanceof Promise) {
                return callback().then((result: any) => {
                    result && updateStdOut({ result })
                })
            } else {
                return new Promise(resolve => {
                    return resolve(res && updateStdOut({ result: res }))
                })
            }
        };

        await Queue.enqueue(wrapper)
    };

    const addToQueue = async (command: string, fn: () => Promise<any>) => {
        const wrapper = promiseWrapper(command);
        await wrapper(fn)
    };

    const commandProcessing = async () => {
        addCommandToHistory(currentCommand);
        clearInput();
        scrollToBottom();

        const commandFn = await getCommandFn(currentCommand.trim(), systemCommands);

        addToQueue(currentCommand, commandFn);
    };

    const getNewHistoryPosition = (direction: HistoryDirectionType) => {
        if (direction === 'up') {
            return historyPosition === null ? 0 : commandsHistory.length - 1 >= historyPosition + 1 ? historyPosition + 1 : 0;
        } else {
            return 0
        }
    };

    const navigationHistory = (direction: HistoryDirectionType) => {
        if (!commandsHistory.length) return;
        const position = getNewHistoryPosition(direction);
        setHistoryPosition(position);
        setCurrentCommand(commandsHistory[position]);
    };

    const scrollToBottom = () => {
        const rootNode = terminalRef.current;

        setTimeout(() => { rootNode.scrollTop = rootNode.scrollHeight }, 1);
    };

    const onKeyUp = async (event: any) => {
        switch (event.key) {
            case 'Enter': await commandProcessing(); break;
            case 'ArrowUp': navigationHistory('up'); break;
            case 'ArrowDown': navigationHistory('down'); break;
        }
    };

    const onChange = (event: any) => {
        setCurrentCommand(event.target.value);
    };

    useEffect(() => {
        focusOnTerminal();
    }, []);

    useEffect(() => {
        scrollToBottom();
    }, [stdOut]);

    return (
        <>
            <Container ref={terminalRef} onClick={focusOnTerminal}>

                {stdOut.map((command, index) => (<Message key={index} command={command.name || ''} text={command.result}/>))}

                <InputContainer>
                    <PromptLabel variant='primary'>$</PromptLabel>
                    <Input
                        ref={inputRef}
                        value={currentCommand}
                        onKeyUp={onKeyUp}
                        onChange={onChange}
                    />
                </InputContainer>
            </Container>
        </>
    );
};

export default Terminal;

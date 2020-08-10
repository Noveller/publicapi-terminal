import React, {FC, memo, ReactNode} from 'react';
import {Command, CommandResult, PromptLabel, MessageContainer} from "../../ui";

interface IProps {
    command?: string;
    text: string | ReactNode
}

const Message: FC<IProps> = ({ command, text }) => {
    return (
        <MessageContainer>
            <PromptLabel>$</PromptLabel> <Command>{command}</Command>
            <CommandResult>
                {text}
            </CommandResult>
        </MessageContainer>
    )
};

export default memo(Message);

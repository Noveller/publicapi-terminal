import styled from "styled-components";


interface IPromptLabelProps {
    variant?: 'default' | 'primary'
}

export const Container = styled.div`
    min-height: 300px;
    max-height: 300px;
    width: 600px;
    border-radius: 5px;
    background: ${props => props.theme.colors.gray};
    fontFamily: monospace;
    padding: 15px;
    overflow: auto;
`;

export const InputContainer = styled.div`
    display: flex;
`;

export const Input = styled.input`
    outline:none;
    border: none;
    background: transparent;
    color: ${props => props.theme.colors.green};
    font-family: monospace;
    margin-left:5px;
    width: 100%;
`;

export const PromptLabel = styled.span<IPromptLabelProps>`
    font-weight: bolder;
    color: ${props => props.variant === 'primary' ? props.theme.colors.green : '#fff' };
    font-family: monospace;
`;

export const MessageContainer = styled.div`
    padding: 3px 0;
`;

export const Command = styled.span`
    color: #fff;
    font-family: monospace;
`;

export const CommandResult = styled.pre`
    color: #fff;
    font-family: monospace;
`;

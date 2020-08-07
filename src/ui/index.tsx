import styled from "styled-components";

export const Container = styled.div`
    min-height: 300px;
    max-height: 300px;
    max-width: 100%;
    border-radius: 5px;
    background: ${props => props.theme.colors.gray};
    fontFamily: monospace;
    padding: 20px 20px 0 20px;
   
    display: flex;
    flex-direction: column;
    overflow: auto;
`;

export const Input = styled.input`
    outline:none;
    border: none;
    background: transparent;
    color: ${props => props.theme.colors.green};
    font-family: monospace;
    margin-left:5px;
`;

export const PromptLabel = styled.span`
    font-weight: bolder;
    color: ${props => props.theme.colors.green};
    font-family: monospace;
`;

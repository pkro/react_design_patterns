

export const Button = ({size, color, text, ...props}: {size: string, color: string, text: string}) => {
    return (
        <button style={{
            padding: size === 'large' ? 32 : 8,
            fontSize: size === 'large' ? 32 : 16,
            backgroundColor: color
        }}
                {...props}>
            {text}
        </button>
    );
};

export const DangerButton = ({text, ...props}: {text: string}) => <Button color={'red'} size={'large'} text={text} />

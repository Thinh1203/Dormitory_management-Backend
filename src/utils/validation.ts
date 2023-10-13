export const checkImageExtension = (name: string): boolean => {
    const regex = /^((([a-zA-Z0-9]+)(\s*))+(\_*)*(\-*))+(.jpg|.png|.jpeg)$/gmi;
    return regex.test(name);
}
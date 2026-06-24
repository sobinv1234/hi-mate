export const IMAGE_BASE_PATH = '/images/';

export const getImage = (imageName) => {
    return `${IMAGE_BASE_PATH}${imageName}`;
};
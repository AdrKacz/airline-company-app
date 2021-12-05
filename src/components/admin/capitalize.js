export const capitalize = (string) => (
    string.split('-').map((word) => (word[0].toUpperCase() + word.slice(1))).join(' ')
);
// adapted from: https://www.tutorialspoint.com/article/how-to-create-and-save-text-file-in-javascript


// call the downloadFile(content) function

const downloadFile = (content) => {
    const link = document.createElement("a");
    const file = new Blob([content], { type: 'image/svg+xml' });
    link.href = URL.createObjectURL(file);
    link.download = "printable_stamp.svg";
    link.click();
    URL.revokeObjectURL(link.href);
};
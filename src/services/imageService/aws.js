export const uploadImage = async (file) => {
    const formData = new FormData();
    formData.append("file", file);

    const res = await fetch("/api/upload/aws", {
        method: "POST",
        body: formData,
    });

    const data = await res.json();
    return data.url;
};
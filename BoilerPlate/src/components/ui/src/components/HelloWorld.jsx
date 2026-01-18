function HelloWorld() {
    const name = "Developer";
    const today = new Date().toLocaleDateString();

    return (
        <div className="p-8 text-center">
            <h1 className="text-4xl font-bold text-blue-600">Hello, {name}!</h1>
        )
    
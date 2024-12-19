import MainLayout from '../../layouts/MainLayout';

export default function CustomerProfile() {
    return (
        <MainLayout>
            <div className="container mx-auto px-6 py-8">
                <h1 className="text-3xl font-bold">Customer Dashboard</h1>
                <div className="mt-6 rounded-xl bg-white p-6 shadow-lg">
                    <h2 className="text-xl font-semibold">Welcome to HomeCook Connect</h2>
                    <p className="mt-2 text-gray-600">Your profile setup is complete.</p>
                </div>
            </div>
        </MainLayout>
    );
}
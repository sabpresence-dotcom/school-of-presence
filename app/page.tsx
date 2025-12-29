import { getServices } from '@/lib/actions';
import { HomeContent } from '@/components/HomeContent';

export const metadata = {
    title: 'Sarpong Andrews Boakye',
    description: 'Helping executives, entrepreneurs, and leaders master the art of speaking with impact — both offline and online.',
};

export default async function Home() {
    const services = await getServices();

    return <HomeContent services={services} />;
}

import { Adset } from '@/app/lib/types';
import { EyeIcon, HandRaisedIcon } from '@heroicons/react/24/solid';
import Link from 'next/link';

interface AdsetCardProps {
  adset: Adset;
  onActivate: () => Promise<void>;
  onPause: () => Promise<void>;
}

export default function AdsetCard({ adset, onActivate, onPause }: AdsetCardProps) {
  const getStatusColor = (status: string) => {
    return status === 'ACTIVE' ? 'bg-green-500' : 'bg-gray-500';
  };

  return (
    <li className="min-w-full border rounded border-gray-300 p-4 m-1 rounded-xl bg-white mx-auto flex flex-col md:flex-row justify-between w-full md:w-3/4">
      <div className="flex justify-between w-full md:w-auto">
        <div className="flex items-center">
          <div className={`w-3 h-3 rounded-full ${getStatusColor(adset.status)}`} />
          <span className="text-xs font-semibold text-gray-700 ml-2">{adset.status}</span>
          <div className="flex flex-col ml-4">
            <p className="font-bold">{adset.name}</p>
          </div>
        </div>
      </div>

      <div className="flex items-center">
        <Link
          href={`/pages/publicaciones/campanas/addsets/creatives?adsetId=${adset.id}`}
          className="flex items-center text-black-500 hover:text-blue-700 ml-5"
        >
          <EyeIcon className="h-5 w-5 mr-2" />
          <div>Ver AddCreatives</div>
        </Link>

        {adset.status === 'PAUSED' ? (
          <button
            onClick={onActivate}
            className="flex items-center text-green-500 hover:text-green-700 ml-5"
          >
            <HandRaisedIcon className="h-5 w-5 mr-2" />
            <div>Activar</div>
          </button>
        ) : (
          <button
            onClick={onPause}
            className="flex items-center text-red-500 hover:text-red-700 ml-5"
          >
            <HandRaisedIcon className="h-5 w-5 mr-2" />
            <div>Pausar</div>
          </button>
        )}
      </div>
    </li>
  );
}
'use client';

import { Transaction } from '@/app/lib/definitions';
import { formatCurrency, formatDate } from '@/app/lib/utils';
import { Eye, Loader2, Trash } from 'lucide-react';
import { useState } from 'react';
import { getTransactionDetail, deleteTransaction } from '@/app/lib/actions';
import ReceiptModal from './receipt-modal';
import { useRouter } from 'next/navigation';

export default function TransactionTable({ transactions }: { transactions: Transaction[] }) {
  const [selectedTx, setSelectedTx] = useState<Transaction | null>(null);
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const router = useRouter();

  const handleViewDetail = async (id: string) => {
    setLoadingId(id);
    try {
      const detail = await getTransactionDetail(id);
      setSelectedTx(detail);
    } catch (error) {
      alert("Gagal mengambil detail transaksi");
    } finally {
      setLoadingId(null);
    }
  };

  const handleDelete = async (id: string) => {
    const confirmDelete = confirm("Yakin ingin menghapus transaksi ini?");
    if (!confirmDelete) return;

    setLoadingId(id);

    const result = await deleteTransaction(id);

    if (!result.success) {
      alert(result.message);
      setLoadingId(null);
      return;
    }

    alert(result.message);
    setLoadingId(null);
    router.refresh();
  };

  return (
    <>
      <div className="rounded-lg bg-pink-50 p-2 md:pt-0 mt-6">
        <table className="min-w-full text-gray-900">
          <thead className="text-left text-sm font-normal">
            <tr>
              <th className="px-4 py-5 font-medium">ID Transaksi</th>
              <th className="px-3 py-5 font-medium">Tanggal & Waktu</th>
              <th className="px-3 py-5 font-medium">Pelanggan</th>
              <th className="px-3 py-5 font-medium">Total</th>
              <th className="py-3 pl-6 pr-3">Aksi</th>
            </tr>
          </thead>

          <tbody className="bg-white">
            {transactions.map((tx) => (
              <tr key={tx.id} className="border-b py-3 text-sm hover:bg-gray-50">
                
                <td className="whitespace-nowrap py-3 pl-6 pr-3 font-mono font-bold text-pink-600">
                  {tx.id}
                </td>

                <td className="whitespace-nowrap px-3 py-3">
                  <div className="flex flex-col">
                    <span className="font-medium">
                      {formatDate(tx.date).split(' pukul ')[0]}
                    </span>
                    <span className="text-xs text-gray-500">
                      {formatDate(tx.date).split(' pukul ')[1]}
                    </span>
                  </div>
                </td>

                <td className="whitespace-nowrap px-3 py-3">
                  {tx.customer_name}
                </td>

                <td className="whitespace-nowrap px-3 py-3 font-bold text-gray-700">
                  {formatCurrency(tx.total_amount)}
                </td>

                <td className="whitespace-nowrap py-3 pl-6 pr-3 flex gap-2">

                  {/* DETAIL */}
                  <button
                    onClick={() => handleViewDetail(tx.id)}
                    disabled={loadingId === tx.id}
                    className="flex items-center gap-1 rounded-md border border-gray-200 px-2 py-1 text-gray-600 hover:bg-gray-100 hover:text-pink-600 transition"
                  >
                    {loadingId === tx.id ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>

                  {/* DELETE */}
                  <button
                    onClick={() => handleDelete(tx.id)}
                    disabled={loadingId === tx.id}
                    className="flex items-center gap-1 rounded-md border border-gray-200 px-2 py-1 text-red-600 hover:bg-red-100 transition"
                  >
                    {loadingId === tx.id ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Trash className="w-4 h-4" />
                    )}
                  </button>

                </td>
              </tr>
            ))}
          </tbody>

        </table>
      </div>

      {/* MODAL */}
      {selectedTx && (
        <ReceiptModal
          transaction={selectedTx}
          onClose={() => setSelectedTx(null)}
        />
      )}
    </>
  );
}

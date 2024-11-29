import axios from "axios";
import { Pagination, } from "antd";
import "./Contracts.css";
import { useEffect, useState } from "react";


const Contracts = () => {
  const [contracts, setContracts] = useState<any[]>([]);
  const [total, setTotal] = useState(0);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(10);

  const accessToken = localStorage.getItem("accessToken");

  const fetchContracts = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        "https://dev.api-erp.najotedu.uz/api/staff/contracts/all",
        {
          params: { page, perPage, search },
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      setContracts(response.data.data.contracts);
      setTotal(response.data.data.total);
    } catch (error) {
      console.error("Ma'lumotlarni yuklashda xatolik yuz berdi:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchContracts();
  }, [page, perPage, search]);

  const handlePageChange = (current: number) => {
    setPage(current);
  };

  const handleShowSizeChange = (current: number, size: number) => {
    setPerPage(size);
    setPage(current);
  };

  const handleEdit = (id: number) => {
    console.log(`Tahrirlash: ${id}`);
  };

  return (
    <div className="container">
      <div className="wrapper" >
        <div className="search_container">
          <input
            className="search"
            type="text"
            placeholder="Qidiruv"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <table className="table">
          <thead>
            <tr>
              <th>#</th>
              <th>Nomi</th>
              <th>Kurs</th>
              <th>Yaratilgan sana</th>
              <th>Amallar</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={5} className="loading">
                  Yuklanmoqda...
                </td>
              </tr>
            ) : contracts.length > 0 ? (
              contracts.map((contract, index) => (
                <tr key={contract.id}>
                  <td>{(page - 1) * perPage + index + 1}</td>
                  <td>{contract.attachment.origName}</td>
                  <td>{contract.course.name || "--"}</td>
                  <td>{new Date(contract.createdAt).toLocaleDateString()}</td>
                  <td>
                    <button
                      className="edit-btn"
                      onClick={() => handleEdit(contract.id)}
                    >
                      Tahrirlash
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} className="no-data">
                  Ma'lumot yo'q
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      <div className="pagination-container">
        <Pagination
          current={page}
          total={total}
          pageSize={perPage}
          onChange={handlePageChange}
          onShowSizeChange={handleShowSizeChange}
          className="custom-pagination"
        />
      </div>
    </div>
  );
};

export default Contracts;

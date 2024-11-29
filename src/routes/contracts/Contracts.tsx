import axios from "axios";
import { Pagination, Select, message, Upload, Modal, Input } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { useEffect, useState } from "react";
import "./Contracts.css";

const Contracts = () => {
  const [contracts, setContracts] = useState<any[]>([]);
  const [total, setTotal] = useState(0);
  const [courses, setCourses] = useState<any[]>([]);
  const [selectedCourse, setSelectedCourse] = useState<number | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [title, setTitle] = useState("");
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false); 
  const [selectedContract, setSelectedContract] = useState<any | null>(null); 

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

  const fetchCourses = async () => {
    try {
      const response = await axios.get(
        "https://dev.api-erp.najotedu.uz/api/staff/courses",
        {
          params: { page: 1, perPage: 100 },
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      setCourses(response.data.data.courses);
    } catch (error) {
      console.error("Kurslarni yuklashda xatolik yuz berdi:", error);
    }
  };

  const uploadFile = async () => {
    if (!file) {
      message.error("Fayl tanlanmagan");
      return null;
    }

    const formData = new FormData();
    formData.append("files", file);

    try {
      const response = await axios.post(
        "https://dev.api-erp.najotedu.uz/api/staff/upload/contract/attachment",
        formData,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );
      return response.data.data[0]; 
    } catch (error) {
      message.error("Faylni yuklashda xatolik yuz berdi");
      return null;
    }
  };

  const addContract = async () => {
    if (!selectedCourse) {
      message.error("Kurs tanlanmagan");
      return;
    }

    const uploadedFile = await uploadFile();
    if (!uploadedFile) return;

    const newContract = {
      title,
      courseId: selectedCourse,
      attachment: {
        size: uploadedFile.size,
        url: uploadedFile.path,
        origName: uploadedFile.fileName,
      },
    };

    try {
      await axios.post(
        "https://dev.api-erp.najotedu.uz/api/staff/contracts/create",
        newContract,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      message.success("Shartnoma muvaffaqiyatli qo'shildi");
      fetchContracts();
      setIsModalVisible(false);
    } catch (error) {
      message.error("Shartnoma qo'shishda xatolik yuz berdi");
    }
  };

  const editContract = async () => {
    if (!selectedContract || !selectedCourse) {
      message.error("Kurs yoki shartnoma tanlanmagan");
      return;
    }

    const uploadedFile = await uploadFile();
    const updatedContract = {
      title,
      courseId: selectedCourse,
      attachment: uploadedFile
        ? {
            size: uploadedFile.size,
            url: uploadedFile.path,
            origName: uploadedFile.fileName,
          }
        : selectedContract.attachment, 
    };

    try {
      await axios.put(
        `https://dev.api-erp.najotedu.uz/api/staff/contracts/${selectedContract.id}`,
        updatedContract,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      message.success("Shartnoma muvaffaqiyatli tahrirlandi");
      fetchContracts();
      setIsEditModalVisible(false);
    } catch (error) {
      message.error("Shartnoma tahririda xatolik yuz berdi");
    }
  };

  const openEditModal = (contract: any) => {
    setSelectedContract(contract);
    setTitle(contract.title);
    setSelectedCourse(contract.courseId);
    setIsEditModalVisible(true);
  };

  useEffect(() => {
    fetchContracts();
    fetchCourses();
  }, [page, perPage, search]);

  return (
    <div className="container">
      <div className="wrapper">
        <div className="search_container">
          <input
            className="search"
            type="text"
            placeholder="Qidiruv"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <button className="add-btn" onClick={() => setIsModalVisible(true)}>
            Qo'shish
          </button>
        </div>
        <table className="table">
          <thead>
            <tr>
              <th>#</th>
              <th>Nomi</th>
              <th>Kurs</th>
              <th></th>
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
                  <td className="actions">
                    <button
                      className="edit-btn"
                      onClick={() => openEditModal(contract)}
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
          onChange={(current) => setPage(current)}
          onShowSizeChange={(size) => setPerPage(size)}
          className="custom-pagination"
        />
      </div>

      <Modal
        title="Shartnoma Qo'shish"
        visible={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        onOk={addContract}
        okText="Qo'shish"
      >
        <div className="modal-content">
          <Input
            className="mb-[12px]"
            placeholder="Shartnoma nomi"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <Select
            className="mb-[12px]"
            placeholder="Kursni tanlang"
            style={{ width: "100%" }}
            onChange={(value) => setSelectedCourse(value)}
          >
            {courses.map((course) => (
              <Select.Option key={course.id} value={course.id}>
                {course.name}
              </Select.Option>
            ))}
          </Select>
          <Upload
            className="mb-[20px]"
            beforeUpload={(file) => {
              if (
                file.type !==
                "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
              ) {
                message.error("Faqat .docx fayllarini yuklash mumkin");
                return false;
              }
              setFile(file);
              return false;
            }}
            maxCount={1}
          >
            <button className="upload-btn">
              <UploadOutlined /> Fayl yuklash
            </button>
          </Upload>
        </div>
      </Modal>

      {/* Edit Modal */}
      <Modal
        title="Shartnomani tahrirlash"
        visible={isEditModalVisible}
        onCancel={() => setIsEditModalVisible(false)}
        onOk={editContract}
        okText="Tahrirla"
      >
        <div className="modal-content">
          <Input
            className="mb-[12px]"
            placeholder="Shartnoma nomi"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <Select
            className="mb-[12px]"
            placeholder="Kursni tanlang"
            value={selectedCourse}
            style={{ width: "100%" }}
            onChange={(value) => setSelectedCourse(value)}
          >
            {courses.map((course) => (
              <Select.Option key={course.id} value={course.id}>
                {course.name}
              </Select.Option>
            ))}
          </Select>
          <Upload
            className="mb-[20px]"
            beforeUpload={(file) => {
              if (
                file.type !==
                "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
              ) {
                message.error("Faqat .docx fayllarini yuklash mumkin");
                return false;
              }
              setFile(file);
              return false;
            }}
            maxCount={1}
          >
            <button className="upload-btn">
              <UploadOutlined /> Fayl yuklash
            </button>
          </Upload>
        </div>
      </Modal>
    </div>
  );
};

export default Contracts;

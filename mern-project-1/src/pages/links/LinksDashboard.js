import IconButton from '@mui/material/IconButton';
import { DataGrid } from '@mui/x-data-grid';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { serverEndpoint } from '../../config/config';
import { Modal } from 'react-bootstrap';
import { usePermission } from '../../rbac/userPermissions';

function LinksDashboard() {
    const [errors, setErrors] = useState({});
    const [linksData, setLinksData] = useState([]);

    const [showModal, setShowModal] = useState(false);
    const [isEdit, setIsEdit] = useState(false);

    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const permission = usePermission();

    const handleShowDeleteModal = (linkId) => {
        setFormData({
            id: linkId
        });
        setShowDeleteModal(true);
    };

    const handleCloseDeleteModal = () => {
        setShowDeleteModal(false);
    };

    const handleDelete = async () => {
        try {
            await axios.delete(`${serverEndpoint}/links/${formData.id}`, {
                withCredentials: true
            });
            await fetchLinks();
            handleCloseDeleteModal();
        } catch (error) {
            setErrors({ message: 'Unable to delete the link, please try again' });
        }
    };

    const handleOpenModal = (isEdit, data = {}) => {
        if (isEdit) {
            setFormData({
                id: data._id,
                campaignTitle: data.campaignTitle,
                originalUrl: data.originalUrl,
                category: data.category
            });
        }

        setIsEdit(isEdit);
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
    };

    const [formData, setFormData] = useState({
        campaignTitle: "",
        originalUrl: "",
        category: ""
    });

    const handleChange = (event) => {
        const name = event.target.name;
        const value = event.target.value;

        setFormData({
            ...formData,
            [name]: value
        });
    };

    const validate = () => {
        let newErrors = {};
        let isValid = true;
        if (formData.campaignTitle.length === 0) {
            newErrors.campaignTitle = "Campaign Title is mandatory";
            isValid = false;
        }

        if (formData.originalUrl.length === 0) {
            newErrors.originalUrl = "URL is mandatory";
            isValid = false;
        }

        if (formData.category.length === 0) {
            newErrors.category = "Category is mandatory";
            isValid = false;
        }

        setErrors(newErrors);
        return isValid;
    }

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (validate()) {
            const body = {
                campaign_title: formData.campaignTitle,
                original_url: formData.originalUrl,
                category: formData.category
            };
            const configuration = {
                withCredentials: true
            };
            try {
                if (isEdit) {
                    await axios.put(
                        `${serverEndpoint}/links/${formData.id}`,
                        body, configuration);
                } else {
                    await axios.post(
                        `${serverEndpoint}/links`,
                        body, configuration);
                }

                await fetchLinks();
                setFormData({
                    campaignTitle: "",
                    originalUrl: "",
                    category: ""
                });
            } catch (error) {
                setErrors({ message: 'Unable to add the Link, please try again' });
            } finally {
                handleCloseModal();
            }
        }
    };

    const fetchLinks = async () => {
        try {
            const response = await axios.get(`${serverEndpoint}/links`, {
                withCredentials: true
            });
            setLinksData(response.data.data);
        } catch (error) {
            console.log(error);
            setErrors({ message: 'Unable to fetch links at the moment. Please try again' });
        }
    };

    useEffect(() => {
        fetchLinks();
    }, []);

    const columns = [
        { field: 'campaignTitle', headerName: 'Campaign', flex: 2 },
        {
            field: 'originalUrl', headerName: 'URL', flex: 3, renderCell: (params) => (
                <>
                    <a href={`${serverEndpoint}/links/r/${params.row._id}`}
                        target='_blank'
                        rel="noopener noreferrer"
                    >
                        {params.row.originalUrl}
                    </a>
                </>
            )
        },
        { field: 'category', headerName: 'Category', flex: 2 },
        { field: 'clickCount', headerName: 'Clicks', flex: 1 },
        {
            field: 'action', headerName: 'Clicks', flex: 1, renderCell: (params) => (
                <>
                    {permission.canEditLink && (
                        <IconButton>
                            <EditIcon onClick={() => handleOpenModal(true, params.row)} />
                        </IconButton>
                    )}

                    {permission.canDeleteLink && (
                        <IconButton>
                            <DeleteIcon onClick={() => handleShowDeleteModal(params.row._id)} />
                        </IconButton>
                    )}
                </>
            )
        },
    ];

    return (
        <div className="container py-4">
            <div className="d-flex justify-content-between mb-3">
                <h2>Manage Affiliate Links</h2>
                {permission.canAddLink && (
                    <button className="btn btn-primary btn-sm" onClick={() => handleOpenModal(false)}>
                        Add
                    </button>
                )}
            </div>

            {errors.message && (
                <div className="alert alert-danger" role="alert">
                    {errors.message}
                </div>
            )}

            <div style={{ height: 500, width: '100%' }}>
                <DataGrid
                    getRowId={(row) => row._id}
                    rows={linksData}
                    columns={columns}
                    initialState={{
                        pagination: {
                            paginationModel: { pageSize: 20, page: 0 }
                        }
                    }}
                    pageSizeOptions={[20, 50, 100]}
                    disableRowSelectionOnClick
                    showToolbar
                    sx={{
                        fontFamily: 'inherit'
                    }}
                    density='compact'
                />
            </div>

            <Modal show={showModal} onHide={() => handleCloseModal()}>
                <Modal.Header closeButton>
                    <Modal.Title>
                        {isEdit ? (<>Update Link</>) : (<>Add Link</>)}
                    </Modal.Title>
                </Modal.Header>

                <Modal.Body>
                    <form onSubmit={handleSubmit}>
                        <div className="mb-3">
                            <label htmlFor="campaignTitle" className="form-label">Campaign Title</label>
                            <input
                                type="text"
                                className={`form-control ${errors.campaignTitle ? 'is-invalid' : ''}`}
                                id="campaignTitle"
                                name="campaignTitle"
                                value={formData.campaignTitle}
                                onChange={handleChange}
                            />
                            {errors.campaignTitle && (
                                <div className="invalid-feedback">
                                    {errors.campaignTitle}
                                </div>
                            )}
                        </div>

                        <div className="mb-3">
                            <label htmlFor="originalUrl" className="form-label">URL</label>
                            <input
                                type="text"
                                className={`form-control ${errors.originalUrl ? 'is-invalid' : ''}`}
                                id="originalUrl"
                                name="originalUrl"
                                value={formData.originalUrl}
                                onChange={handleChange}
                            />
                            {errors.originalUrl && (
                                <div className="invalid-feedback">
                                    {errors.originalUrl}
                                </div>
                            )}
                        </div>

                        <div className="mb-3">
                            <label htmlFor="category" className="form-label">Category</label>
                            <input
                                type="text"
                                className={`form-control ${errors.category ? 'is-invalid' : ''}`}
                                id="category"
                                name="category"
                                value={formData.category}
                                onChange={handleChange}
                            />
                            {errors.category && (
                                <div className="invalid-feedback">
                                    {errors.category}
                                </div>
                            )}
                        </div>

                        <div className="d-grid">
                            <button type="submit" className="btn btn-primary">Submit</button>
                        </div>
                    </form>
                </Modal.Body>
            </Modal>

            <Modal show={showDeleteModal} onHide={() => handleCloseDeleteModal()}>
                <Modal.Header closeButton>
                    <Modal.Title>Confirm Delete</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <p>Are you sure you want to delete the link?</p>
                </Modal.Body>
                <Modal.Footer>
                    <button className='btn btn-secondary'
                        onClick={() => handleCloseDeleteModal()}
                    >
                        Cancel
                    </button>
                    <button className='btn btn-danger'
                        onClick={() => handleDelete()}
                    >
                        Delete
                    </button>
                </Modal.Footer>
            </Modal>
        </div>
    );
}

export default LinksDashboard;
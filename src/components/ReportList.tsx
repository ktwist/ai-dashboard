import { generateReportContent } from "../api/openai";
import { useState } from "react";
import { useReportStore } from "../store/reportStore";
// import { useAuth } from "../context/AuthContext";
import {
    Container, Input, Heading, Button, List, Stack, Modal, IconButton, Panel, InputGroup, Divider
} from 'rsuite';
import EditIcon from '@rsuite/icons/Edit';
import TrashIcon from '@rsuite/icons/Trash';
import CreativeIcon from '@rsuite/icons/Creative';
import SearchIcon from '@rsuite/icons/Search';
import PlusRoundIcon from '@rsuite/icons/PlusRound';

const ReportList = () => {
    const { reports, addReport, removeReport, editReport } = useReportStore();
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [editingId, setEditingId] = useState<number | null>(null);
    const [editTitle, setEditTitle] = useState("");
    const [editContent, setEditContent] = useState("");
    const [search, setSearch] = useState(""); // Search state
    const [loadingAI, setLoadingAI] = useState(false);
    // const { role, user } = useAuth();

    const handleAdd = () => {
        setEditingId(null);
        if (title && content) {
            addReport(title, content);
            setTitle("");
            setContent("");
            handleClose()
        }
    };

    const startEdit = (id: number, currentTitle: string, currentContent: string) => {
        setEditingId(id);
        setEditTitle(currentTitle);
        setEditContent(currentContent);
        handleOpen();
    };

    const handleEditSave = (id: number) => {
        if (editTitle && editContent) {
            editReport(id, editTitle, editContent);
            setEditingId(null);
            setEditTitle("");
            setEditContent("");
        }
        handleClose();
    };

    const handleEditCancel = () => {
        setEditingId(null);
        setEditTitle("");
        setEditContent("");
    };

    const handleGenerateAI = async () => {
        const promtText = editTitle || title;
        if (!promtText) return;
        setLoadingAI(true);
        try {
            const aiContent = await generateReportContent(promtText);
            editTitle ? setEditContent(aiContent) : setContent(aiContent);
        } catch (err) {
            alert("Failed to generate content.");
        }
        setLoadingAI(false);
    };

    const [open, setOpen] = useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => {
        handleEditCancel();
        setOpen(false)
    };

    // Filter reports by title (case-insensitive)
    const filteredReports = reports.filter(report =>
        report.title.toLowerCase().includes(search.toLowerCase())
    );

    return (

        <Container>
            <Modal open={open} onClose={handleClose} backdrop="static">
                <Modal.Header>
                    <Modal.Title>{editingId ? `Edit Report` : `Add Report`}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Stack direction='column' spacing={10} alignItems="stretch">
                        <Input
                            placeholder="Title"
                            value={editTitle || title}
                            onChange={value => editingId ? setEditTitle(value) : setTitle(value)}
                        />
                        <Input as="textarea" rows={3}
                            placeholder="Content"
                            value={editContent || content}
                            onChange={value => editingId ? setEditContent(value) : setContent(value)}
                        />
                        <Button startIcon={<CreativeIcon />} onClick={handleGenerateAI} loading={loadingAI} appearance="primary" color="green">
                            Generate with AI
                        </Button>
                    </Stack>
                </Modal.Body>
                <Modal.Footer>
                    {editingId ? <Button onClick={() => handleEditSave(editingId)}>Save Report</Button> :
                        <Button onClick={handleAdd}>Add Report</Button>}
                    <Button onClick={handleClose} appearance="subtle">
                        Cancel
                    </Button>
                </Modal.Footer>
            </Modal>
            <Stack direction="row" justifyContent="space-between" alignItems="center" style={{ margin: 20 }}>
                <Button color="orange" startIcon={<PlusRoundIcon />} onClick={handleOpen} appearance="primary">New Report</Button>

                <InputGroup >
                    <InputGroup.Addon>
                        <SearchIcon />
                    </InputGroup.Addon>
                    <Input
                        placeholder="Search by Title"
                        value={search}
                        onChange={value => setSearch(value)}
                    />
                </InputGroup>
            </Stack>

            <Divider color="orange" style={{ margin: '40px 0' }}><Heading level={4} style={{ marginRight: 10 }}>Reports</Heading></Divider>

            <List sortable bordered style={{ margin: 20 }}>
                {filteredReports.map((report) => (
                    <List.Item key={report.id} index={report.id} style={{ padding: 10 }}>
                        <Stack direction='row' justifyContent="space-between" alignItems="center">
                            <Heading level={6} >{report.title}</Heading>
                            <Stack direction='row' spacing={10}>
                                <IconButton color="green" appearance="primary" icon={<EditIcon />} onClick={() => startEdit(report.id, report.title, report.content)} />
                                <IconButton color="red" appearance="primary" icon={<TrashIcon />} onClick={() => removeReport(report.id)} /></Stack>
                        </Stack>
                    </List.Item>
                ))}
            </List>

        </Container >
    );
};

export default ReportList;
import { generateReportContent } from "../api/openai";
import { useState } from "react";
import { useReportStore } from "../store/reportStore";
import {
    Container, Input, Heading, Button, List, Stack, Modal
} from 'rsuite';

const ReportList = () => {
    const { reports, addReport, removeReport, editReport } = useReportStore();
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [editingId, setEditingId] = useState<number | null>(null);
    const [editTitle, setEditTitle] = useState("");
    const [editContent, setEditContent] = useState("");
    const [search, setSearch] = useState(""); // Search state
    const [loadingAI, setLoadingAI] = useState(false);

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
            <Modal open={open} onClose={handleClose}>
                <Modal.Header>
                    <Modal.Title>{editingId ? `Edit Report` : `Add Report`}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
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

                    <Button onClick={handleGenerateAI} loading={loadingAI} appearance="primary" style={{ marginLeft: 8 }}>
                        Generate with AI
                    </Button>
                    <Heading level={5}>Reports</Heading>
                </Modal.Body>
                <Modal.Footer>
                    {editingId ? <Button onClick={() => handleEditSave(editingId)}>Save Report</Button> :
                        <Button onClick={handleAdd}>Add Report</Button>}
                    <Button onClick={handleClose} appearance="subtle">
                        Cancel
                    </Button>
                </Modal.Footer>
            </Modal>
            <Button onClick={handleOpen}>New Report</Button>

            <Input
                placeholder="Search by Title"
                value={search}
                onChange={value => setSearch(value)}
                style={{ marginBottom: 10, display: "block" }}
            />

            <List sortable bordered>
                {filteredReports.map((report) => (
                    <List.Item key={report.id} index={report.id}>
                        <Stack direction='row'>
                            <Heading level={5} >{report.title}</Heading>
                            <Button appearance="primary" onClick={() => startEdit(report.id, report.title, report.content)} style={{ marginLeft: 10 }}>Edit</Button>
                            <Button appearance="default" onClick={() => removeReport(report.id)} color="red" style={{ marginLeft: 5 }}>Delete</Button>
                        </Stack>
                    </List.Item>
                ))}
            </List>
        </Container>
    );
};

export default ReportList;
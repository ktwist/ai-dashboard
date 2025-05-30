import { generateReportContent } from "../api/openai";
import { useState, useRef } from "react";
import { useReportStore } from "../store/reportStore";
// import { useAuth } from "../context/AuthContext";
import {
    Container, Input, Heading, Button, List, Stack, Modal, IconButton, InputGroup, Divider
} from 'rsuite';
import EditIcon from '@rsuite/icons/Edit';
import TrashIcon from '@rsuite/icons/Trash';
import CreativeIcon from '@rsuite/icons/Creative';
import SearchIcon from '@rsuite/icons/Search';
import PlusRoundIcon from '@rsuite/icons/PlusRound';
import SaveIcon from '@rsuite/icons/Save';
// import { Editor } from '@tinymce/tinymce-react';
import { Editor } from '@tinymce/tinymce-react';
import type { Editor as TinyMCEEditorType } from 'tinymce';

const ReportList = () => {
    const { reports, addReport, removeReport, editReport } = useReportStore();
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [promptText, setPromptText] = useState("");
    const [editingId, setEditingId] = useState<number | null>(null);
    const [editTitle, setEditTitle] = useState("");
    const [editContent, setEditContent] = useState("");
    const [search, setSearch] = useState(""); // Search state
    const [loadingAI, setLoadingAI] = useState(false);
    // const { role, user } = useAuth();

    const editorRef = useRef<TinyMCEEditorType | null>(null);

    const mceApiKey = import.meta.env.VITE_TINYMCE_API_KEY;

    const handleAdd = () => {
        setEditingId(null);
        if (title && content) {
            if (editorRef.current) {
                addReport(title, editorRef.current.getContent());
            }
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
            if (editorRef.current) {
                editReport(id, editTitle, editorRef.current.getContent());
            }
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
        if (editingId && editorRef.current) {
            setPromptText(editorRef.current.getContent({ format: 'text' }));
        }
        if (!promptText && !editingId) return;
        setLoadingAI(true);
        try {
            const aiContent = await generateReportContent(promptText);
            editTitle ? setEditContent(aiContent) : setContent(aiContent);
            editorRef.current?.setContent(aiContent);
        } catch (err) {
            alert("Failed to generate content.");
        }
        setLoadingAI(false);
        setPromptText("");
    };

    const [open, setOpen] = useState(false);
    const handleOpen = () => {
        setOpen(true);
    }
    const handleClose = () => {
        handleEditCancel();
        setOpen(false)
    };

    // Filter reports by title (case-insensitive)
    const filteredReports = reports.filter(report =>
        report.title.toLowerCase().includes(search.toLowerCase())
    );

    console.log("editContent || content outside ---->>> ", editContent, content);
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
                        <>
                            <Editor
                                apiKey={mceApiKey}
                                onInit={(_evt, editor) => {
                                    editorRef.current = editor as TinyMCEEditorType;
                                }}
                                initialValue={editContent}
                                init={{
                                    height: 500,
                                    menubar: false,
                                    plugins: [
                                        'advlist', 'autolink', 'lists', 'link', 'image', 'charmap', 'preview',
                                        'anchor', 'searchreplace', 'visualblocks', 'code', 'fullscreen',
                                        'insertdatetime', 'media', 'table', 'code', 'help', 'wordcount'
                                    ],
                                    toolbar: 'undo redo | blocks | ' +
                                        'bold italic forecolor | alignleft aligncenter ' +
                                        'alignright alignjustify | bullist numlist outdent indent | ' +
                                        'removeformat | help',
                                    content_style: 'body { font-family:Helvetica,Arial,sans-serif; font-size:14px }'
                                }}
                            />
                            {/* <button onClick={log}>Log editor content</button> */}
                        </>
                        {!editingId &&
                            <Input as="textarea" rows={3}
                                placeholder="Enter report idea here to generate content"
                                value={promptText}
                                onChange={value => setPromptText(value)}
                            />}
                        {editingId ?
                            (<Button startIcon={<CreativeIcon />} onClick={handleGenerateAI} loading={loadingAI} appearance="primary" color="green" >
                                Summarize with AI
                            </Button>) :
                            (<Button startIcon={<CreativeIcon />} onClick={handleGenerateAI} loading={loadingAI} appearance="primary" color="green" disabled={!promptText}>
                                Generate with AI
                            </Button>)
                        }
                    </Stack>
                </Modal.Body>
                <Modal.Footer>
                    {editingId ? <Button startIcon={<SaveIcon />} color="blue" appearance="primary" onClick={() => handleEditSave(editingId)}>Save Report</Button> :
                        <Button appearance="primary" color="blue" startIcon={<PlusRoundIcon />} onClick={handleAdd}>Add Report</Button>}
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
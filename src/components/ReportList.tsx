import { generateReportContent } from "../api/openai";
import { useState, useRef } from "react";
import { useReportStore } from "../store/reportStore";
import {
    Container, Input, Heading, Button, List, Stack, IconButton, InputGroup, Divider
} from 'rsuite';
import EditIcon from '@rsuite/icons/Edit';
import TrashIcon from '@rsuite/icons/Trash';
import ReportModal from "./ReportModal";
import SearchIcon from '@rsuite/icons/Search';
import PlusRoundIcon from '@rsuite/icons/PlusRound';
import type { Editor as TinyMCEEditorType } from 'tinymce';

const initialReport = { id: null, title: "", content: "" };

const ReportList = () => {
    const { reports, addReport, removeReport, editReport } = useReportStore();
    const [modalMode, setModalMode] = useState<'add' | 'edit' | null>(null);
    const [current, setCurrent] = useState<{ id: number | null, title: string, content: string }>(initialReport);
    const [promptText, setPromptText] = useState("");
    const [search, setSearch] = useState("");
    const [loadingAI, setLoadingAI] = useState(false);
    const editorRef = useRef<TinyMCEEditorType | null>(null);
    const mceApiKey = import.meta.env.VITE_TINYMCE_API_KEY;

    const openAdd = () => {
        setCurrent(initialReport);
        setModalMode('add');
    };

    const openEdit = (report: { id: number, title: string, content: string }) => {
        setCurrent(report);
        setModalMode('edit');
    };

    const closeModal = () => {
        setModalMode(null);
        setCurrent(initialReport);
        setPromptText("");
    };

    const handleSave = () => {
        if (modalMode === 'add') {
            addReport(current.title, current.content);
        } else if (modalMode === 'edit' && current.id !== null) {
            editReport(current.id, current.title, current.content);
        }
        closeModal();
    };

    const handleGenerateAI = async () => {
        setLoadingAI(true);
        try {
            const aiContent = await generateReportContent(promptText || current.title);
            setCurrent(prev => ({ ...prev, content: aiContent }));
        } catch {
            alert("Failed to generate content.");
        }
        setLoadingAI(false);
    };

    const filteredReports = reports.filter(report =>
        report.title.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <Container>
            <ReportModal
                open={!!modalMode}
                editingId={modalMode === 'edit' ? current.id : null}
                editTitle={current.title}
                editContent={current.content}
                title={current.title}
                promptText={promptText}
                loadingAI={loadingAI}
                mceApiKey={mceApiKey}
                onTitleChange={title => setCurrent(prev => ({ ...prev, title }))}
                onEditTitleChange={title => setCurrent(prev => ({ ...prev, title }))}
                onContentChange={content => setCurrent(prev => ({ ...prev, content }))}
                onPromptTextChange={setPromptText}
                onEditorInit={editor => { editorRef.current = editor; }}
                onGenerateAI={handleGenerateAI}
                onAdd={handleSave}
                onEditSave={handleSave}
                onClose={closeModal}
            />
            <Stack direction="row" justifyContent="space-between" alignItems="center" style={{ margin: 20 }}>
                <Button color="orange" startIcon={<PlusRoundIcon />} onClick={openAdd} appearance="primary">New Report</Button>
                <InputGroup>
                    <InputGroup.Addon>
                        <SearchIcon />
                    </InputGroup.Addon>
                    <Input
                        placeholder="Search by Title"
                        value={search}
                        onChange={setSearch}
                    />
                </InputGroup>
            </Stack>
            <Divider color="orange" style={{ margin: '40px 0' }}>
                <Heading level={4} style={{ marginRight: 10 }}>Reports</Heading>
            </Divider>
            <List sortable bordered style={{ margin: 20 }}>
                {filteredReports.map((report) => (
                    <List.Item key={report.id} index={report.id} style={{ padding: 10 }}>
                        <Stack direction='row' justifyContent="space-between" alignItems="center">
                            <Heading level={6}>{report.title}</Heading>
                            <Stack direction='row' spacing={10}>
                                <IconButton color="green" appearance="primary" icon={<EditIcon />} onClick={() => openEdit(report)} />
                                <IconButton color="red" appearance="primary" icon={<TrashIcon />} onClick={() => removeReport(report.id)} />
                            </Stack>
                        </Stack>
                    </List.Item>
                ))}
            </List>
        </Container>
    );
};

export default ReportList;
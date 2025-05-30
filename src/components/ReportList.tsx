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
import { useAuth } from "../context/AuthContext";

const initialReport = { id: null, title: "", content: "" };

const ReportList = () => {
    const { reports, addReport, removeReport, editReport } = useReportStore();
    const { role } = useAuth(); // Get the current user role
    const [modalMode, setModalMode] = useState<'add' | 'edit' | null>(null);
    const [current, setCurrent] = useState<{ id: number | null, title: string, content: string }>(initialReport);
    const [promptText, setPromptText] = useState("");
    const [search, setSearch] = useState("");
    const [loadingAI, setLoadingAI] = useState(false);
    const editorRef = useRef<TinyMCEEditorType | null>(null);
    const mceApiKey = import.meta.env.VITE_TINYMCE_API_KEY;

    // Only allow admins to open add/edit modals
    const openAdd = () => {
        if (role !== "admin") return;
        setCurrent(initialReport);
        setModalMode('add');
    };

    const openEdit = (report: { id: number, title: string, content: string }) => {
        if (role !== "admin") return;
        setCurrent(report);
        setModalMode('edit');
    };

    // Allow viewers to open modal in view mode
    const openView = (report: { id: number, title: string, content: string }) => {
        if (role !== "viewer") return;
        setCurrent(report);
        setModalMode(null); // null means view mode for viewer
    };

    const closeModal = () => {
        setModalMode(null);
        setCurrent(initialReport);
        setPromptText("");
    };

    const handleSave = () => {
        if (role !== "admin") return;
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

    const filteredReports = (reports ?? []).filter(
        report =>
            typeof report?.title === "string" &&
            report.title.toLowerCase().includes(search.toLowerCase())
    );

    // Handles reordering of reports in the list
    function handleSortEnd(payload?: { oldIndex: number; newIndex: number }) {
        if (!payload) return;
        const { oldIndex, newIndex } = payload;
        if (oldIndex === newIndex) return;

        const sortedReports = [...reports].sort((a, b) => a.index - b.index);

        const [moved] = sortedReports.splice(oldIndex, 1);
        sortedReports.splice(newIndex, 0, moved);

        const updatedReports = sortedReports.map((report, idx) => ({
            ...report,
            index: idx,
        }));

        useReportStore.getState().setReports(updatedReports);
    }

    return (
        <Container>
            <ReportModal
                role={role}
                open={!!modalMode || (role === "viewer" && current.id !== null)}
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
                <Button
                    color="orange"
                    startIcon={<PlusRoundIcon />}
                    onClick={openAdd}
                    appearance="primary"
                    disabled={role !== "admin"}
                >
                    New Report
                </Button>
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
            <List sortable={role === "admin"} bordered style={{ margin: 20 }} onSort={handleSortEnd}>
                {filteredReports.map((report) => (
                    <List.Item key={report.id} index={report.index} style={{ padding: 10 }}>
                        <Stack direction='row' justifyContent="space-between" alignItems="center">
                            <Stack direction='row' spacing={10}>
                                <Heading level={6}>{report.index + 1}</Heading>
                                <Heading level={6}>{report.title}</Heading>
                            </Stack>
                            <Stack direction='row' spacing={10}>
                                {role === "admin" ? (
                                    <>
                                        <IconButton
                                            color="green"
                                            appearance="primary"
                                            icon={<EditIcon />}
                                            onClick={() => openEdit(report)}
                                            disabled={role !== "admin"}
                                        />
                                        <IconButton
                                            color="red"
                                            appearance="primary"
                                            icon={<TrashIcon />}
                                            onClick={() => role === "admin" && removeReport(report.id)}
                                            disabled={role !== "admin"}
                                        />
                                    </>
                                ) : (
                                    <Button
                                        appearance="primary"
                                        size="sm"
                                        onClick={() => openView(report)}
                                    >
                                        View
                                    </Button>
                                )}
                            </Stack>
                        </Stack>
                    </List.Item>
                ))}
            </List>
        </Container>
    );
};

export default ReportList;
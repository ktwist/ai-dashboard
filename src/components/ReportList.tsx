import { generateReportContent } from "../api/openai";
import { useState } from "react";
import { useReportStore } from "../store/reportStore";
import {
    Container, Input, Heading, Button, List, Stack
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
        if (title && content) {
            addReport(title, content);
            setTitle("");
            setContent("");
        }
    };

    const startEdit = (id: number, currentTitle: string, currentContent: string) => {
        setEditingId(id);
        setEditTitle(currentTitle);
        setEditContent(currentContent);
    };

    const handleEditSave = (id: number) => {
        if (editTitle && editContent) {
            editReport(id, editTitle, editContent);
            setEditingId(null);
            setEditTitle("");
            setEditContent("");
        }
    };

    const handleEditCancel = () => {
        setEditingId(null);
        setEditTitle("");
        setEditContent("");
    };

    const handleGenerateAI = async () => {
        if (!title) return;
        setLoadingAI(true);
        try {
            const aiContent = await generateReportContent(title);
            setContent(aiContent);
        } catch (err) {
            alert("Failed to generate content.");
        }
        setLoadingAI(false);
    };

    // Filter reports by title (case-insensitive)
    const filteredReports = reports.filter(report =>
        report.title.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <Container>
            <Input
                placeholder="Title"
                value={title}
                onChange={value => setTitle(value)}
            />
            <Input as="textarea" rows={3}
                placeholder="Content"
                value={content}
                onChange={value => setContent(value)}
            />
            <Button onClick={handleAdd}>Add Report</Button>
            <Button onClick={handleGenerateAI} loading={loadingAI} appearance="primary" style={{ marginLeft: 8 }}>
                Generate with AI
            </Button>
            <Heading level={5}>Reports</Heading>
            <Input
                placeholder="Search by Title"
                value={search}
                onChange={value => setSearch(value)}
                style={{ marginBottom: 10, display: "block" }}
            />

            <List sortable bordered>
                {filteredReports.map((report) => (
                    <List.Item key={report.id} index={report.id}>
                        {editingId === report.id ? (
                            <Stack>
                                <Input
                                    value={editTitle}
                                    onChange={e => setEditTitle(e)}
                                    placeholder="Edit Title"
                                    style={{ marginBottom: 5 }}
                                />
                                <Input
                                    as="textarea"
                                    rows={3}
                                    value={editContent}
                                    onChange={e => setEditContent(e)}
                                    placeholder="Edit Content"
                                />
                                <Button onClick={() => handleEditSave(report.id)} appearance="primary" style={{ marginRight: 5 }}>Save</Button>
                                <Button onClick={handleEditCancel} appearance="default">Cancel</Button>
                            </Stack>
                        ) : (
                            <Stack direction='row'>
                                <Heading level={5} >{report.title}</Heading>
                                <Button appearance="primary" onClick={() => startEdit(report.id, report.title, report.content)} style={{ marginLeft: 10 }}>Edit</Button>
                                <Button appearance="default" onClick={() => removeReport(report.id)} color="red" style={{ marginLeft: 5 }}>Delete</Button>
                            </Stack>
                        )}

                    </List.Item>
                ))}
            </List>
        </Container>
    );
};

export default ReportList;
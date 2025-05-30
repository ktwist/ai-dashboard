import { type FC } from "react";
import { Modal, Stack, Input, Button } from "rsuite";
import CreativeIcon from '@rsuite/icons/Creative';
import PlusRoundIcon from '@rsuite/icons/PlusRound';
import SaveIcon from '@rsuite/icons/Save';
import { Editor } from '@tinymce/tinymce-react';
import type { Editor as TinyMCEEditorType } from 'tinymce';

type ReportModalProps = {
    open: boolean;
    editingId: number | null;
    editTitle: string;
    editContent: string;
    title: string;
    promptText: string;
    loadingAI: boolean;
    mceApiKey: string;
    onTitleChange: (value: string) => void;
    onEditTitleChange: (value: string) => void;
    onPromptTextChange: (value: string) => void;
    onEditorInit: (editor: TinyMCEEditorType) => void;
    onGenerateAI: () => void;
    onAdd: () => void;
    onEditSave: () => void;
    onClose: () => void;
    onContentChange: (content: string) => void;
};

const ReportModal: FC<ReportModalProps> = ({
    open,
    editingId,
    editTitle,
    editContent,
    title,
    promptText,
    loadingAI,
    mceApiKey,
    onTitleChange,
    onEditTitleChange,
    onPromptTextChange,
    onEditorInit,
    onGenerateAI,
    onAdd,
    onEditSave,
    onClose,
    onContentChange,
}) => (
    <Modal open={open} onClose={onClose} backdrop="static">
        <Modal.Header>
            <Modal.Title>{editingId ? `Edit Report` : `Add Report`}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
            <Stack direction='column' spacing={10} alignItems="stretch">
                <Input
                    placeholder="Title"
                    value={editingId ? editTitle : title}
                    onChange={value => editingId ? onEditTitleChange(value) : onTitleChange(value)}
                />
                <Editor
                    apiKey={mceApiKey}
                    value={editContent}
                    onEditorChange={content => onContentChange(content)}
                    onInit={(_evt, editor) => {
                        onEditorInit(editor as TinyMCEEditorType);
                    }}
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
                {!editingId &&
                    <Input as="textarea" rows={3}
                        placeholder="Enter report idea here to generate content"
                        value={promptText}
                        onChange={onPromptTextChange}
                    />}
                {editingId ?
                    (<Button startIcon={<CreativeIcon />} onClick={onGenerateAI} loading={loadingAI} appearance="primary" color="green" >
                        Summarize with AI
                    </Button>) :
                    (<Button startIcon={<CreativeIcon />} onClick={onGenerateAI} loading={loadingAI} appearance="primary" color="green" disabled={!promptText}>
                        Generate with AI
                    </Button>)
                }
            </Stack>
        </Modal.Body>
        <Modal.Footer>
            {editingId ? <Button startIcon={<SaveIcon />} color="blue" appearance="primary" onClick={onEditSave}>Save Report</Button> :
                <Button appearance="primary" color="blue" startIcon={<PlusRoundIcon />} onClick={onAdd}>Add Report</Button>}
            <Button onClick={onClose} appearance="subtle">
                Cancel
            </Button>
        </Modal.Footer>
    </Modal>
);

export default ReportModal;
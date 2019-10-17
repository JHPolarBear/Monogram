import * as React from 'react'
import { Form, Button } from 'semantic-ui-react'
import Auth from '../auth/Auth'
import { getUploadUrl, uploadFile } from '../api/items-api'
import { string } from 'prop-types'

export enum UploadState {
  NoUpload,
  FetchingPresignedUrl,
  UploadingFile,
}

interface EditItemProps {
  match: {
    params: {
      itemId: string
    }
  }
  auth: Auth
}

interface EditItemState {
  title: string
  desc: string
  file: any
  uploadState: UploadState
}

export class EditItem extends React.PureComponent<
EditItemProps,
EditItemState
> {
  state: EditItemState = {
    title: '',
    desc: '',
    file: undefined,
    uploadState: UploadState.NoUpload
  }

  handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files
    if (!files) return

    this.setState({
      file: files[0]
    })
  }

  handleTitleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const _title = event.target.textContent
    if (!_title) return

    this.setState({
      title: _title
    })
  }
  
  handleDescChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const _desc = event.target.textContent
    if (!_desc) return

    this.setState({
      desc: _desc
    })
  }

  handleSubmit = async (event: React.SyntheticEvent) => {
    event.preventDefault()

    try {

      // only check the file
      if (!this.state.file) {
        alert('File should be selected')
        return
      }

      this.setUploadState(UploadState.FetchingPresignedUrl)
      const uploadUrl = await getUploadUrl(this.props.auth.getIdToken(), this.props.match.params.itemId)

      this.setUploadState(UploadState.UploadingFile)
      await uploadFile(uploadUrl, this.state.file)

      alert('File was uploaded!')
    } catch (e) {
      alert('Could not upload a file: ' + e.message)
    } finally {
      this.setUploadState(UploadState.NoUpload)
    }
  }

  setUploadState(uploadState: UploadState) {
    this.setState({
      uploadState
    })
  }

  render() {
    return (
      <div>
        <h1>Upload new image</h1>

        <Form onSubmit={this.handleSubmit}>
        <Form.Field>
            <label>Title</label>
            <input
              type="text"
              placeholder="Enter Title..."
              onChange={this.handleTitleChange}
            />
          </Form.Field>
          <Form.Field>
            <label>Desc</label>
            <input
              type="text"
              placeholder="Enter Description..."
              onChange={this.handleDescChange}
            />
          </Form.Field>
          <Form.Field>
            <label>File</label>
            <input
              type="file"
              accept="image/*"
              placeholder="Image to upload"
              onChange={this.handleFileChange}
            />
          </Form.Field>

          {this.renderButton()}
        </Form>
      </div>
    )
  }

  renderButton() {

    return (
      <div>
        {this.state.uploadState === UploadState.FetchingPresignedUrl && <p>Uploading image metadata</p>}
        {this.state.uploadState === UploadState.UploadingFile && <p>Uploading file</p>}
        <Button
          loading={this.state.uploadState !== UploadState.NoUpload}
          type="submit"
        >
          Upload
        </Button>
      </div>
    )
  }
}

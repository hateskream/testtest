package auth_state

import (
	"bytes"
	"encoding/json"
	"fmt"
	"io"
	"mime/multipart"
	"net/http"

	"github.com/casdoor/casdoor-go-sdk/casdoorsdk"
)

var client = &http.Client{}

func (s *AuthState) doPost(action string, queryMap map[string]string, postBytes []byte, isForm, isFile bool) (*casdoorsdk.Response, error) {
	url := s.client.GetUrl(action, queryMap)

	var err error
	var contentType string
	var body io.Reader
	if isForm {
		if isFile {
			contentType, body, err = createFormFile(map[string][]byte{"file": postBytes})
			if err != nil {
				return nil, err
			}
		} else {
			var params map[string]string
			err = json.Unmarshal(postBytes, &params)
			if err != nil {
				return nil, err
			}

			contentType, body, err = createForm(params)
			if err != nil {
				return nil, err
			}
		}
	} else {
		contentType = "text/plain;charset=UTF-8"
		body = bytes.NewReader(postBytes)
	}

	respBytes, err := s.doPostBytesRaw(url, contentType, body)
	if err != nil {
		return nil, err
	}

	var response casdoorsdk.Response
	err = json.Unmarshal(respBytes, &response)
	if err != nil {

		return nil, err
	}

	if response.Status != "ok" {
		return nil, fmt.Errorf("%s", response.Msg)
	}

	return &response, nil
}

func (s *AuthState) doPostBytesRaw(url string, contentType string, body io.Reader) ([]byte, error) {
	if contentType == "" {
		contentType = "text/plain;charset=UTF-8"
	}

	var resp *http.Response

	req, err := http.NewRequest("POST", url, body)
	if err != nil {
		return nil, err
	}

	req.Header.Set("Content-Type", contentType)

	resp, err = client.Do(req)
	if err != nil {
		return nil, err
	}
	defer func(Body io.ReadCloser) {
		err := Body.Close()
		if err != nil {
			return
		}
	}(resp.Body)

	respBytes, err := io.ReadAll(resp.Body)
	if err != nil {
		return nil, err
	}

	if resp.StatusCode != http.StatusOK && resp.StatusCode != http.StatusForbidden {
		return nil, fmt.Errorf("%s", string(respBytes))
	}

	return respBytes, nil
}

func createFormFile(formData map[string][]byte) (string, io.Reader, error) {
	// https://tonybai.com/2021/01/16/upload-and-download-file-using-multipart-form-over-http/

	body := new(bytes.Buffer)
	w := multipart.NewWriter(body)
	defer w.Close()

	for k, v := range formData {
		pw, err := w.CreateFormFile(k, "file")
		if err != nil {
			panic(err)
		}

		_, err = pw.Write(v)
		if err != nil {
			panic(err)
		}
	}

	return w.FormDataContentType(), body, nil
}

func createForm(formData map[string]string) (string, io.Reader, error) {
	body := new(bytes.Buffer)
	w := multipart.NewWriter(body)
	for k, v := range formData {
		if err := w.WriteField(k, v); err != nil {
			return "", nil, err
		}
	}
	if err := w.Close(); err != nil {
		return "", nil, err
	}

	return w.FormDataContentType(), body, nil
}

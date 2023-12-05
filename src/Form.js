/*global chrome*/
/*global miro*/
import { DeleteOutlined, PlusCircleOutlined, RestOutlined, SaveOutlined } from '@ant-design/icons';
import { Button, Form, Select, Input, Row, Col, Card, InputNumber, Modal } from 'antd';
import React, { useRef, useEffect, useState } from 'react';
import random from 'randomcolor';
import jira from './jira'
let colors = [];

chrome.storage.sync.get('colors', (data) => {
  if (!data.colors?.length) {
    const newColors = Array(100).fill('').map(() => random());
    chrome.storage.sync.set({ colors: newColors });
    colors = newColors
  } else {
    colors = data.colors;
  }
});

export default () => {
  const [form] = Form.useForm();
  const [sprints, setSprints] = useState([]);


  useEffect(() => {
    chrome.runtime.onMessage.addListener(
      function (request, sender, sendResponse) {
        console.log(request)
        if (request?.issues) {
          form.setFieldsValue({
            tasks: request.issues.map((issue) => ({
              id: issue.key.split('-')[1],
              title: issue.title,
              front: issue.front ? issue.front / 60 / 60 : 0,
              back: (issue.back || issue.task) ? (issue.back || issue.task) / 60 / 60 : 0,
              test: issue.test ? issue.test / 60 / 60 : 0,
            }))
          })

          chrome.storage.sync.set(form.getFieldsValue());
        }
        if (request?.sprints) {

          setSprints(request.sprints)

        }
      }
    );
  }, [])

  const onFinish = () => {
    const tasks = form.getFieldValue('tasks').map((item, index) => ({ ...item, color: colors[index] }));

    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      chrome.tabs.sendMessage(tabs[0].id, tasks, function (response) {
        console.log(response?.farewell);
      });
    });
  }

  const changeColor = (key) => {
    const newColors = [...colors]
    newColors[key] = random();
    chrome.storage.sync.set({ colors: newColors });
    colors = newColors;
    form.setFieldValue('tasks', [...form.getFieldValue('tasks')])
  }

  const onFieldsChange = () => {
    chrome.storage.sync.set(form.getFieldsValue());
  }


  const onApplyJira = () => {

    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      chrome.tabs.sendMessage(tabs[0].id, { jira: true }, function (response) {
        // console.log(response?.farewell);
      });
    });
    // form.setFieldsValue({
    //   tasks: jira.issues.map((issue, index) => ({

    //     id: issue.key.split('-')[1],
    //     title: issue.fields?.summary,
    //     color: colors[index],
    //     front: issue.fields.subtasks.find(t => t.fields.summary.includes('FE'))
    //       ? 2 : 1,
    //     back: issue.fields.subtasks.find(t => t.fields.summary.includes('BE'))
    //       ? 2 : 1,
    //     test: issue.fields.subtasks.find(t => t.fields.summary.includes('QE'))
    //       ? 2 : 1,
    //   }))
    // })
  }


  const resetAll = () => {
    form.setFieldsValue({ tasks: [] });
    chrome.storage.sync.set({ tasks: [] });
  }

  const onSelectSprint = id => {
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      chrome.tabs.sendMessage(tabs[0].id, { issues: id });
    });
  }

  useEffect(() => {
    chrome.storage.sync.get('tasks', data => form.setFieldsValue(data));
  }, []);

  return (
    <Form form={form} onValuesChange={onFieldsChange} onFinish={onFinish} autoComplete="off">
      <Form.List name="tasks">
        {(fields, { add, remove }) => (
          <>
            {fields.map(({ key, name, ...restField }, index) => (
              <Card onClick={() => changeColor(key)} style={{ backgroundColor: (colors)[index] }}>
                <Row gutter={[12, 12]} >
                  <Col span={6}>
                    <Form.Item {...restField} name={[name, 'id']} >
                      <InputNumber placeholder="Номер задачи" />
                    </Form.Item>
                  </Col >
                  <Col span={16}>
                    <Form.Item {...restField} name={[name, 'title']} >
                      <Input placeholder="Заголовок задачи" />
                    </Form.Item>
                  </Col>
                  <Col span={2}>
                    <Button onClick={() => remove(name)} icon={<DeleteOutlined />}></Button>
                  </Col>
                  <Col span={8}>
                    <Form.Item {...restField} name={[name, 'back']}>
                      <InputNumber step={1} min={0} max={48} placeholder="BE" />
                    </Form.Item>
                  </Col>
                  <Col span={8}>
                    <Form.Item   {...restField} name={[name, 'front']} >
                      <InputNumber step={1} min={0} max={48} placeholder="FE" />
                    </Form.Item>
                  </Col>
                  <Col span={8}>
                    <Form.Item  {...restField} name={[name, 'test']}>
                      <InputNumber step={1} min={0} max={48} placeholder="QA" />
                    </Form.Item>
                  </Col>
                </Row>
              </Card>
            ))}

            <Row gutter={12} className='controls'>
              <Col span={4}>
                <Form.Item>
                  <Button onClick={() => add()} block icon={<PlusCircleOutlined />} />
                </Form.Item>
              </Col>


              <Col span={12}>
                <Form.Item name='sprints'>
                  <Select onChange={onSelectSprint} onClick={onApplyJira}>
                    {sprints.map(item => (
                      <Select.Option key={item.value} value={item.value}>{item.label}</Select.Option>
                    ))}
                  </Select>
                </Form.Item>
              </Col>

              <Col span={4}>
                <Form.Item>
                  <Button type="primary" icon={<SaveOutlined />} block htmlType="submit" />
                </Form.Item>
              </Col>

              <Col span={4}>
                <Form.Item>
                  <Button onClick={resetAll} icon={<RestOutlined />} danger type="primary" block htmlType="submit" />
                </Form.Item>
              </Col>
            </Row>
          </>
        )}
      </Form.List>
    </Form>
  );
};

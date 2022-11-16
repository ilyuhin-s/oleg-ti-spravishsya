/*global chrome*/
/*global miro*/
import { DeleteOutlined, SettingOutlined, PlusOutlined, EditOutlined, EllipsisOutlined } from '@ant-design/icons';
import { Button, Form, Input, Row, Col, Card, InputNumber } from 'antd';
import React from 'react';
import random from 'randomcolor';

const color = Array(100).fill('').map(() => random());

export default () => {
    async function getCurrentTab() {
        let queryOptions = { active: true, currentWindow: true };
        // `tab` will either be a `tabs.Tab` instance or `undefined`.
        let [tab] = await chrome.tabs.query(queryOptions);
        console.log(tab, 'tab')
        return tab.id;
      }

    const onFinish = async () => {

        function changeBackgroundColor() {
            console.log('test123')
            window.miro.board.createShape()
        }

        const tabId = await getCurrentTab();

        chrome.scripting.executeScript(
            {
                target: { tabId: tabId },
                func: changeBackgroundColor,
            },
            () => console.log('success')
        );
    }

    return (
        <Form name="dynamic_form_nest_item" onFinish={onFinish} autoComplete="off">
            <Form.List name="users">
                {(fields, { add, remove }) => (
                    <>
                        {fields.map(({ key, name, ...restField }, index) => (
                            <Card
                                style={{ backgroundColor: color[index] }}
                            >
                                <Row gutter={[12, 12]} >
                                    <Col span={6}>
                                        <Form.Item
                                            {...restField}
                                            name={[name, 'id']}
                                        >
                                            <InputNumber placeholder="Номер задачи" />
                                        </Form.Item>
                                    </Col >
                                    <Col span={16}>
                                        <Form.Item
                                            {...restField}
                                            name={[name, 'title']}
                                        >
                                            <Input placeholder="Заголовок задачи" />
                                        </Form.Item>
                                    </Col>
                                    <Col span={2}>
                                        <Button onClick={() => remove(name)} icon={<DeleteOutlined />}></Button>
                                    </Col>
                                    <Col span={8}>
                                        <Form.Item
                                            {...restField}
                                            name={[name, 'back']}
                                        >
                                            <InputNumber step={1} min={0} max={48} placeholder="BE" />
                                        </Form.Item>
                                    </Col>
                                    <Col span={8}>
                                        <Form.Item
                                            {...restField}
                                            name={[name, 'front']}
                                        >
                                            <InputNumber step={1} min={0} max={48} placeholder="FE" />
                                        </Form.Item>
                                    </Col>
                                    <Col span={8}>
                                        <Form.Item
                                            {...restField}
                                            name={[name, 'test']}
                                        >
                                            <InputNumber step={1} min={0} max={48} placeholder="QA" />
                                        </Form.Item>
                                    </Col>
                                </Row>
                            </Card>
                        ))}
                        <Row gutter={12} className='controls'>
                            <Col span={12}>
                                <Form.Item>
                                    <Button onClick={() => add()} block>
                                        Добавить
                                    </Button>
                                </Form.Item>
                            </Col>
                            <Col span={12}>
                                <Form.Item>
                                    <Button type="primary" block htmlType="submit">
                                        Сохранить
                                    </Button>
                                </Form.Item>
                            </Col>

                        </Row>
                    </>
                )}
            </Form.List>

        </Form>
    );
}
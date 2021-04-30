import React from 'react';
import { useIdentity } from '../libs/netlify-identity-provider';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { Button, Col, Form, Spinner } from 'react-bootstrap';
import classNames from 'classnames';
import { useRouter } from 'next/router';

export const loginSchema = yup.object({
  user: yup
    .string()
    .email()
    .when('inviteToken', {
      is: (inviteToken: string) => inviteToken == '',
      then: yup.string().required(),
    }),
  password: yup.string().required(),
  inviteToken: yup.string(),
});

interface FormData {
  username: string;
  password: string;
  inviteToken?: string;
}

type LoginFormProps = {
  inviteToken?: string;
};

const LoginForm: React.FC<LoginFormProps> = ({ inviteToken }) => {
  const { login, inProgress, acceptInvite } = useIdentity();
  const router = useRouter();

  const {
    formState: { errors, submitCount },
    handleSubmit,
    register,
  } = useForm<FormData>({
    defaultValues: {
      username: !!inviteToken ? inviteToken : '',
      password: '',
      inviteToken,
    },
    resolver: yupResolver(loginSchema),
  });

  const onSubmit = async ({ inviteToken, username, password }: FormData) => {
    if (inviteToken && inviteToken > '') {
      try {
        const result = await acceptInvite(inviteToken, password);
        await router.push('/login');
      } catch (e) {
        console.error(e?.message || e);
      }
    } else {
      const user = await login(username, password, true);

      // @ts-ignore
      if (user.error) {
        // @ts-ignore
        alert(user.error);
      }
    }
  };

  console.log(errors);

  return (
    <div className="container">
      <Form
        noValidate
        onSubmit={handleSubmit(onSubmit)}
        className={classNames({
          'was-validated': submitCount > 0,
        })}
      >
        <Form.Row>
          {!inviteToken && (
            <Form.Group as={Col} lg={12} controlId="username">
              <Form.Control
                type="email"
                required
                placeholder="Email Address"
                {...register('username')}
              />
              {errors && errors.username && (
                <Form.Control.Feedback type="invalid">
                  {errors.username.message}
                </Form.Control.Feedback>
              )}
            </Form.Group>
          )}
          {!!inviteToken && (
            <Form.Group as={Col} lg={12} controlId="inviteToken">
              <Form.Control
                type="text"
                required
                placeholder="Invite Token"
                {...register('inviteToken')}
              />
              {errors && errors.inviteToken && (
                <Form.Control.Feedback type="invalid">
                  {errors.inviteToken.message}
                </Form.Control.Feedback>
              )}
            </Form.Group>
          )}
          <Form.Group as={Col} lg={12}>
            <Form.Control
              type="password"
              required
              placeholder="Password"
              {...register('password')}
            />
            {errors && errors.password && (
              <Form.Control.Feedback type="invalid">
                {errors.password.message}
              </Form.Control.Feedback>
            )}
          </Form.Group>
        </Form.Row>

        <Form.Row>
          <Button type="submit" disabled={inProgress} block={true}>
            Login{' '}
            {inProgress && (
              <Spinner
                as="span"
                animation="border"
                size="sm"
                role="status"
                aria-hidden="true"
              />
            )}
          </Button>
        </Form.Row>
      </Form>
    </div>
  );
};

export default LoginForm;
